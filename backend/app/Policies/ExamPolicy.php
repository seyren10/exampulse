<?php

namespace App\Policies;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ExamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Teachers see their exams, students see published exams in enrolled classrooms
     */
    public function view(User $user, Exam $exam): bool
    {
        if ($user->isTeacher()) {
            return $user->id === $exam->classroom->teacher_id;
        }

        return $exam->is_published && $exam->classroom->students->contains($user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isTeacher();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Exam $exam): bool
    {
        return $user->isTeacher() && $exam->classroom->teacher_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Exam $exam): bool
    {
        return $this->update($user, $exam);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Exam $exam): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Exam $exam): bool
    {
        return false;
    }
}
