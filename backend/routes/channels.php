<?php

use App\Models\LiveQuizSession;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public quiz channel (anyone with room code can listen)
Broadcast::channel('quiz.{roomCode}', function ($user, $roomCode) {
    // Verify user is a participant or teacher of this quiz
    $session = LiveQuizSession::where('room_code', $roomCode)->first();
    
    if (!$session) {
        return false;
    }
    
    // Teacher can listen
    if ($session->teacher_id === $user->id) {
        return true;
    }
    
    // Student participant can listen
    return $session->participants()->where('student_id', $user->id)->exists();
});