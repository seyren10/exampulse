<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'exam_id',
    'question_text',
    'image_path',
    'points',
    'order',
])]
class Question extends Model
{
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

     public function options(): HasMany
    {
        return $this->hasMany(Option::class)->orderBy('order');
    }

    // Helper: Get correct option(s)
    public function correctOptions()
    {
        return $this->options()->where('is_correct', true)->get();
    }
}
