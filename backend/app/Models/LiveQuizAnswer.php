<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'live_quiz_session_id',
    'participant_id',
    'question_id',
    'selected_option_id',
    'is_correct',
    'points_earned',
    'time_taken',
])]
class LiveQuizAnswer extends Model
{
    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    // Relationships
    public function session(): BelongsTo
    {
        return $this->belongsTo(LiveQuizSession::class, 'live_quiz_session_id');
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(LiveQuizParticipant::class, 'participant_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function selectedOption(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'selected_option_id');
    }
}
