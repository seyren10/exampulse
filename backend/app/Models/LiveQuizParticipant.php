<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'live_quiz_session_id',
    'student_id',
    'total_score',
    'correct_answers',
    'joined_at',
])]
class LiveQuizParticipant extends Model
{
    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
        ];
    }

    // Relationships
    public function session(): BelongsTo
    {
        return $this->belongsTo(LiveQuizSession::class, 'live_quiz_session_id');
    }


    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }


    public function answers(): HasMany
    {
        return $this->hasMany(LiveQuizAnswer::class, 'participant_id');
    }
}
