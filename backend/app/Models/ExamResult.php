<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'exam_session_id',
    'student_id',
    'exam_id',
    'score',
    'total_points',
    'percentage',
    'rank',
    'certificate_path',
    'email_sent',
])]
class ExamResult extends Model
{
    protected function casts(): array
    {
        return [
            'email_sent' => 'boolean',
        ];
    }

    // Relationships
    public function session(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class, 'exam_session_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
}
