<?php

namespace App\Jobs;

use App\Enums\ExamSessionStatus;
use App\Events\ExamGraded;
use App\Models\Answer;
use App\Models\ExamResult;
use App\Models\ExamSession;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\Backoff;
use Illuminate\Queue\Attributes\Tries;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

#[Tries(3)]
#[Backoff(10, 30, 60)]
class GradeExamJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamSession $examSession)
    {
        $this->onQueue('grading');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        DB::transaction(function () {
            $session = $this->examSession->fresh();

            // Load answers with their questions and correct options
            $session->load(['answers.question.options', 'answers.selectedOption']);

            $totalScore = 0;
            $totalPoints = 0;

            $session->answers()->each(function (Answer $answer) use (&$totalScore, &$totalPoints) {
                $question = $answer->question;
                $totalPoints += $question->points;

                // Check if selected option is correct
                $isCorrect = $answer->selectedOption?->is_correct ?? false;
                $pointsEarned = $isCorrect ? $question->points : 0;

                $answer->update([
                    'is_correct' => $isCorrect,
                    'points_earned' => $pointsEarned,
                ]);

                $totalScore += $pointsEarned;
            });

            // Update session with score
            $session->update([
                'score' => $totalScore,
                'total_points' => $totalPoints,
                'status' => ExamSessionStatus::Graded,
            ]);

            // Create exam result
            $percentage = $totalPoints > 0 ? ($totalScore / $totalPoints) * 100 : 0;

            $result = ExamResult::create([
                'exam_session_id' => $session->id,
                'student_id' => $session->student_id,
                'exam_id' => $session->exam_id,
                'score' => $totalScore,
                'total_points' => $totalPoints,
                'percentage' => round($percentage, 2),
            ]);

            // Fire ExamGraded event
            event(new ExamGraded($result));
        });
    }


    public function failed(\Throwable $exception): void
    {
        // Log the failure
        Log::error('GradeExamJob failed', [
            'session_id' => $this->examSession->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
