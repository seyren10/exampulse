<?php

namespace App\Policies;

use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ExamSessionPolicy
{
    public function verifyStudent(User $user, ExamSession $examSession): bool
    {
        return $examSession->student_id === $user->id;
    }
}
