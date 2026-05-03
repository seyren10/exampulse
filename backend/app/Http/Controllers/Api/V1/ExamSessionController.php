<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ExamSessionStatus;
use App\Events\ExamSubmitted;
use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitAnswerExamSessionRequest;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ExamSessionController extends Controller
{
    /**
     * Start exam session
     */
    public function start(Request $request, Exam $exam)
    {
        $user = Auth::user();

        // Check if student is enrolled in the classroom
        if (!$exam->classroom->students->contains($user->id)) {
            return response()->json([
                'message' => 'You are not enrolled in this classroom'
            ], 403);
        }

        // Check if exam is published
        if (!$exam->is_published) {
            return response()->json([
                'message' => 'This exam is not available yet'
            ], 403);
        }

        // Check if session already exists
        $existingSession = ExamSession::where('exam_id', $exam->id)
            ->where('student_id', $user->id)
            ->first();

        if ($existingSession) {
            return response()->json([
                'message' => 'You have already started this exam',
                'session' => $existingSession,
            ], 400);
        }

        // Calculate expiration time
        $expiresAt = $exam->time_limit
            ? now()->addMinutes($exam->time_limit)
            : null;

        // Create new session
        $session = ExamSession::create([
            'exam_id' => $exam->id,
            'student_id' => $user->id,
            'started_at' => now(),
            'expires_at' => $expiresAt,
            'status' => ExamSessionStatus::InProgress,
        ]);

        return response()->json([
            'message' => 'Exam session started',
            'session' => $session,
        ], 201);
    }

    /**
     * Submit answer to a question
     */
    public function submitAnswer(SubmitAnswerExamSessionRequest $request, ExamSession $session)
    {
        // Verify session belongs to authenticated user
        Gate::authorize('verifyStudent', $session);

        // Check if session is still active
        if ($session->status !== ExamSessionStatus::InProgress) {
            return response()->json([
                'message' => 'This exam session is no longer active'
            ], 400);
        }

        // Check if expired
        if ($session->isExpired()) {
            $session->update(['status' => ExamSessionStatus::Expired]);
            return response()->json([
                'message' => 'Time limit exceeded'
            ], 400);
        }

        $validated = $request->validated();

        // Verify question belongs to this exam
        $question = Question::findOrFail($validated['question_id']);
        if ($question->exam_id !== $session->exam_id) {
            return response()->json(['message' => 'Invalid question'], 400);
        }

        // Create or update answer
        $answer = $session->answers()->updateOrCreate(
            ['question_id' => $validated['question_id']],
            ['selected_option_id' => $validated['selected_option_id']]
        );

        return response()->json([
            'message' => 'Answer submitted',
            'answer' => $answer,
        ]);
    }

    /**
     * Submit entire exam
     */
    public function submit(Request $request, ExamSession $session)
    {
        // Verify session belongs to authenticated user
        Gate::authorize('verifyStudent', $session);

        // Check if already submitted
        if ($session->status !== ExamSessionStatus::InProgress) {
            return response()->json([
                'message' => 'Exam already submitted'
            ], 400);
        }

        // Update session
        $session->update([
            'submitted_at' => now(),
            'status' => ExamSessionStatus::Submitted,
        ]);

        // Fire ExamSubmitted event (triggers grading chain)
        event(new ExamSubmitted($session));

        return response()->json([
            'message' => 'Exam submitted successfully. Grading in progress.',
            'session' => $session->fresh(),
        ]);
    }

    /**
     * Get exam result
     */
    public function result(Request $request, ExamSession $session)
    {
        // Verify session belongs to authenticated user
        Gate::authorize('verifyStudent', $session);

        $session->load(['result', 'answers.question', 'answers.selectedOption']);

        return response()->json([
            'session' => $session,
        ]);
    }
}
