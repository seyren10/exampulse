<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Classroom;
use App\Models\Exam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ExamController extends Controller
{
    /**
     * List exams for a classroom
     */
    public function index(Classroom $classroom)
    {
        Gate::authorize('view', $classroom);

        $user = Auth::user();

        $query = $classroom->exams()->withCount('questions');

        // Students only see published exams
        if ($user->isStudent()) {
            $query->where('is_published', true);
        }

        $exams = $query->latest()->get();

        return ExamResource::collection($exams);
    }

    /**
     * Get single exam with questions
     */
    public function show(Exam $exam)
    {
        Gate::authorize('view', $exam);

        $exam->load(['questions.options', 'classroom.teacher:id,name']);

        return new ExamResource($exam);
    }

    /**
     * Create new exam
     */
    public function store(StoreExamRequest $request, Classroom $classroom)
    {
        Gate::authorize('update', $classroom);

        $validated = $request->validated();

        $exam = $classroom->exams()->create($validated);

        return new ExamResource($exam);
    }

    /**
     * Update exam
     */
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        $validated = $request->validated();

        $exam->update($validated);

        return new ExamResource($exam->fresh());
    }

    /**
     * Delete exam
     */
    public function destroy(Exam $exam)
    {
        Gate::authorize('delete', $exam);

        $exam->delete();

        return response()->noContent();
    }
}
