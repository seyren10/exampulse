<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClassroomRequest;
use App\Http\Requests\UpdateClassroomRequest;
use App\Http\Resources\ClassroomResource;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ClassroomController extends Controller
{
    /**
     * List all classrooms (teacher: owned, student: enrolled)
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->input('per_page', 25);

        $classrooms = $user->isTeacher() ?
            $user->classrooms()->withCount(['students', 'exams'])->latest()->paginate($perPage) :
            $user->enrolledClassrooms()->withCount(['students', 'exams'])->latest()->paginate($perPage);

        return ClassroomResource::collection($classrooms);
    }

    /**
     * Get a single classroom
     */
    public function show(Classroom $classroom)
    {
        Gate::authorize('view', $classroom);

        $classroom->load(['teacher:id,name,email', 'students:id,name,email', 'exams']);

        return new ClassroomResource($classroom);
    }

    /**
     * Create a new classroom (teachers only)
     */
    public function store(StoreClassroomRequest $request)
    {
        Gate::authorize('create', Classroom::class);

        $validated = $request->validated();
        $teacher = Auth::user();
        $classroom = $teacher->classrooms()->create($validated);

        return new ClassroomResource($classroom);
    }


    /**
     * Update classroom
     */
    public function update(UpdateClassroomRequest $request, Classroom $classroom)
    {
        Gate::authorize('update', $classroom);

        $validated = $request->validated();

        $classroom->update($validated);

        return new ClassroomResource($classroom->fresh());
    }

    /**
     * Delete classroom
     */
    public function destroy(Classroom $classroom)
    {
        Gate::authorize('delete', $classroom);

        $classroom->delete();

        return response()->noContent();
    }

    /**
     * Student joins classroom via code
     */
    public function join(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'exists:classrooms,code'],
        ]);

        $classroom = Classroom::where('code', $validated['code'])->firstOrFail();

        $user = $request->user();

        // Check if already enrolled
        if ($classroom->students->contains($user->id)) {
            return response()->json([
                'message' => 'Already enrolled in this classroom'
            ], 400);
        }

        $classroom->students()->attach($user->id, [
            'joined_at' => now(),
        ]);

        return new ClassroomResource($classroom->fresh());
    }

    public function leave(Classroom $classroom)
    {
        $classroom->students()->detach(Auth::id());

        return response()->noContent();
    }

}
