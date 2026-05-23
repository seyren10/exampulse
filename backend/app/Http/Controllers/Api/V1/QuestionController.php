<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AutosaveQuestionRequest;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Exam;
use App\Models\Question;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class QuestionController extends Controller
{

    public function index(Exam $exam)
    {
        Gate::authorize('view', $exam);
        $options = $exam->questions()->with('options')->paginate(50);

        return QuestionResource::collection($options);
    }
    /**
     * Create question with options
     */
    public function store(StoreQuestionRequest $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        $validated = $request->validated();

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('questions', 'public');
        }

        // Create question
        $question = $exam->questions()->create([
            'question_text' => $validated['question_text'],
            'image_path' => $imagePath,
            'points' => $validated['points'] ?? 1,
            'order' => $validated['order'] ?? $exam->questions()->count(),
        ]);

        // Create options
        foreach ($validated['options'] as $index => $optionData) {
            $question->options()->create([
                'option_text' => $optionData['option_text'],
                'is_correct' => $optionData['is_correct'],
                'order' => $optionData['order'] ?? $index,
            ]);
        }

        $question->load('options');

        return new QuestionResource($question);
    }

    /**
     * Update question
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        Gate::authorize('update', $question);

        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($question->image_path) {
                Storage::disk('public')->delete($question->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('questions', 'public');
        }

        $question->update($validated);

        return new QuestionResource($question->fresh('options'));
    }

    /**
     * Delete question
     */
    public function destroy(Question $question)
    {
        Gate::authorize('delete', $question);

        // Delete image if exists
        if ($question->image_path) {
            Storage::disk('public')->delete($question->image_path);
        }

        $question->delete();

        return response()->noContent();
    }
}
