<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ExamType;
use App\Enums\LiveQuizSessionStatus;
use App\Events\LeaderboardUpdated;
use App\Events\QuestionPushed;
use App\Events\QuizCompleted;
use App\Events\QuizStarting;
use App\Http\Controllers\Controller;
use App\Http\Requests\JoinLiveQuizRequest;
use App\Http\Requests\SubmitAnswerLiveQuizRequest;
use App\Models\Exam;
use App\Models\LiveQuizAnswer;
use App\Models\LiveQuizParticipant;
use App\Models\LiveQuizSession;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class LiveQuizController extends Controller
{
    /**
     * Teacher creates a live quiz session
     */
    public function create(Request $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        // Verify exam is type 'live'
        if ($exam->type !== ExamType::Live) {
            return response()->json([
                'message' => 'Only live quizzes can have sessions'
            ], 400);
        }

        // Check if there's already an active session for this exam
        $existingSession = LiveQuizSession::where('exam_id', $exam->id)
            ->whereIn('status', [LiveQuizSessionStatus::Waiting->value, LiveQuizSessionStatus::Active->value])
            ->first();

        if ($existingSession) {
            return response()->json([
                'message' => 'An active session already exists',
                'session' => $existingSession,
            ], 400);
        }

        // Create new session
        $session = LiveQuizSession::create([
            'exam_id' => $exam->id,
            'teacher_id' => $request->user()->id,
            'status' => LiveQuizSessionStatus::Waiting->value,
        ]);

        return response()->json([
            'message' => 'Live quiz session created',
            'session' => $session,
        ], 201);
    }

    /**
     * Student joins a live quiz via room code
     */
    public function join(JoinLiveQuizRequest $request)
    {
        $validated = $request->validated();

        $session = LiveQuizSession::where('room_code', $validated['room_code'])->firstOrFail();

        // Check if quiz hasn't started yet
        if (!$session->isWaiting()) {
            return response()->json([
                'message' => 'Quiz has already started or completed'
            ], 400);
        }

        $student = $request->user();

        // Check if already joined
        $existingParticipant = $session->participants()
            ->where('student_id', $student->id)
            ->first();

        if ($existingParticipant) {
            return response()->json([
                'message' => 'Already joined this quiz',
                'session' => $session,
            ], 400);
        }

        // Add participant
        $participant = $session->participants()->create([
            'student_id' => $student->id,
        ]);

        return response()->json([
            'message' => 'Joined quiz successfully',
            'session' => $session,
            'participant' => $participant,
        ]);
    }

    /**
     * Teacher starts the quiz
     */
    public function start(Request $request, LiveQuizSession $session)
    {
        Gate::authorize('update', $session->exam);

        if (!$session->isWaiting()) {
            return response()->json([
                'message' => 'Quiz has already started'
            ], 400);
        }

        $session->update([
            'status' => LiveQuizSessionStatus::Active,
            'started_at' => now(),
        ]);

        // Broadcast quiz starting
        broadcast(new QuizStarting($session));

        return response()->json([
            'message' => 'Quiz started',
            'session' => $session->fresh(),
        ]);
    }

    /**
     * Teacher pushes next question
     */
    public function nextQuestion(Request $request, LiveQuizSession $session)
    {
        Gate::authorize('update', $session->exam);

        if (!$session->isActive()) {
            return response()->json([
                'message' => 'Quiz is not active'
            ], 400);
        }

        $questions = $session->exam->questions()->orderBy('order')->get();
        $nextIndex = $session->current_question_index;

        if ($nextIndex >= $questions->count()) {
            return response()->json([
                'message' => 'No more questions'
            ], 400);
        }

        $nextQuestion = $questions[$nextIndex];

        $session->update([
            'current_question_id' => $nextQuestion->id,
            'current_question_index' => $nextIndex + 1,
        ]);

        // Broadcast question to all participants
        broadcast(new QuestionPushed(
            $session->fresh(),
            $nextQuestion,
            $nextIndex + 1
        ));

        return response()->json([
            'message' => 'Question pushed',
            'question' => $nextQuestion,
            'question_number' => $nextIndex + 1,
        ]);
    }

    /**
     * Student submits answer to current question
     */
    public function submitAnswer(SubmitAnswerLiveQuizRequest $request, LiveQuizSession $session)
    {
        $validated = $request->validated();

        $student = Auth::user();

        // Find participant
        /**
         * @var LiveQuizParticipant $participant 
         */
        $participant = $session->participants()
            ->where('student_id', $student->id)
            ->firstOrFail();

        // Verify question is the current question
        if ($validated['question_id'] != $session->current_question_id) {
            return response()->json([
                'message' => 'Not the current question'
            ], 400);
        }

        // Check if already answered this question
        $existingAnswer = LiveQuizAnswer::where('participant_id', $participant->id)
            ->where('question_id', $validated['question_id'])
            ->first();

        if ($existingAnswer) {
            return response()->json([
                'message' => 'Already answered this question'
            ], 400);
        }

        // Get question and check answer
        $question = Question::with('options')->findOrFail($validated['question_id']);
        $selectedOption = $question->options()->findOrFail($validated['selected_option_id']);

        $isCorrect = $selectedOption->is_correct;
        $pointsEarned = $isCorrect ? $question->points : 0;

        // Create answer
        LiveQuizAnswer::create([
            'live_quiz_session_id' => $session->id,
            'participant_id' => $participant->id,
            'question_id' => $validated['question_id'],
            'selected_option_id' => $validated['selected_option_id'],
            'is_correct' => $isCorrect,
            'points_earned' => $pointsEarned,
            'time_taken' => $validated['time_taken'] ?? null,
        ]);

        // Update participant score
        $participant->increment('total_score', $pointsEarned);
        if ($isCorrect) {
            $participant->increment('correct_answers');
        }

        return response()->json([
            'message' => 'Answer submitted',
            'is_correct' => $isCorrect,
            'points_earned' => $pointsEarned,
        ]);
    }

    /**
     * Teacher reveals answer and updates leaderboard
     */
    public function revealAnswer(Request $request, LiveQuizSession $session)
    {
        Gate::authorize('update', $session->exam);

        if (!$session->current_question_id) {
            return response()->json([
                'message' => 'No active question'
            ], 400);
        }

        // Get leaderboard
        $leaderboard = $this->getLeaderboard($session);

        // Broadcast leaderboard update
        broadcast(new LeaderboardUpdated($session, $leaderboard));

        return response()->json([
            'message' => 'Answer revealed',
            'leaderboard' => $leaderboard,
        ]);
    }

    /**
     * Teacher ends the quiz
     */
    public function end(Request $request, LiveQuizSession $session)
    {
        Gate::authorize('update', $session->exam);

        $session->update([
            'status' => LiveQuizSessionStatus::Completed,
            'ended_at' => now(),
        ]);

        // Get final leaderboard
        $finalLeaderboard = $this->getLeaderboard($session);

        // Broadcast quiz completed
        broadcast(new QuizCompleted($session, $finalLeaderboard));

        return response()->json([
            'message' => 'Quiz ended',
            'final_leaderboard' => $finalLeaderboard,
        ]);
    }

    /**
     * Get current leaderboard
     */
    public function leaderboard(LiveQuizSession $session)
    {
        $leaderboard = $this->getLeaderboard($session);

        return response()->json([
            'leaderboard' => $leaderboard,
        ]);
    }

    /**
     * Helper: Generate leaderboard
     */
    private function getLeaderboard(LiveQuizSession $session): array
    {
        $participants = $session->participants()
            ->with('student:id,name')
            ->orderByDesc('total_score')
            ->orderByDesc('correct_answers')
            ->get();

        return $participants->map(function ($participant, $index) {
            return [
                'rank' => $index + 1,
                'student_name' => $participant->student->name,
                'student_id' => $participant->student_id,
                'total_score' => $participant->total_score,
                'correct_answers' => $participant->correct_answers,
            ];
        })->toArray();
    }

}
