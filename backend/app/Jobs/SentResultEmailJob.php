<?php

namespace App\Jobs;

use App\Models\ExamResult;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\Backoff;
use Illuminate\Queue\Attributes\Tries;
use Illuminate\Support\Facades\Log;

#[Tries(3), Backoff(10, 30, 60)]
class SentResultEmailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamResult $examResult)
    {
        $this->onQueue('notifications');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $result = $this->examResult->fresh();
        $result->load(['student', 'exam']);

        // Simple email for now (we'll use Mailable in Phase 6)
        $data = [
            'student_name' => $result->student->name,
            'exam_title' => $result->exam->title,
            'score' => $result->score,
            'total_points' => $result->total_points,
            'percentage' => $result->percentage,
            'rank' => $result->rank,
        ];

        // For now, just log (we'll configure mail in Phase 6)
        Log::info('Exam result email would be sent', $data);

        // Mark email as sent
        $result->update(['email_sent' => true]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('SentResultEmailJob failed', [
            'result_id' => $this->examResult->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
