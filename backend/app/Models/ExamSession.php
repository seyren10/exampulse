<?php

namespace App\Models;

use App\Enums\ExamSessionStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'exam_id',
    'student_id',
    'started_at',
    'submitted_at',
    'expires_at',
    'status',
    'score',
    'total_points',
    'rank',
])]
class ExamSession extends Model
{
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
            'status' => ExamSessionStatus::class,
            'expires_at' => 'datetime',
        ];
    }

    // Relationships
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    public function result(): HasOne
    {
        return $this->hasOne(ExamResult::class);
    }

    // Helpers
    public function isExpired(): bool
    {
        return $this->expires_at && now()->isAfter($this->expires_at);
    }

    public function isSubmitted(): bool
    {
        return $this->status === ExamSessionStatus::Submitted;
    }


    public function isGraded(): bool
    {
        return $this->status === ExamSessionStatus::Graded;
    }
}
