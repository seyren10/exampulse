<?php

namespace App\Models;

use App\Enums\LiveQuizSessionStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'exam_id',
    'teacher_id',
    'room_code',
    'status',
    'current_question_id',
    'current_question_index',
    'started_at',
    'ended_at',
]),
]
class LiveQuizSession extends Model
{
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'status' => LiveQuizSessionStatus::class
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (LiveQuizSession $session) {
            $session->room_code = Str::random(6);
        });
    }

    // Relationships
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function currentQuestion(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'current_question_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(LiveQuizParticipant::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(LiveQuizAnswer::class);
    }

    // Helpers
    public function isWaiting(): bool
    {
        return $this->status === LiveQuizSessionStatus::Waiting;
    }

    public function isActive(): bool
    {
        return $this->status === LiveQuizSessionStatus::Active;
    }

    public function isCompleted(): bool
    {
        return $this->status === LiveQuizSessionStatus::Completed;
    }
}
