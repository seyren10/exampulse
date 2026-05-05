<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

#[Fillable([
    'exam_id',
    'question_text',
    'image_path',
    'points',
    'order',
])]
class Question extends Model
{
    use Searchable;

    // Indexes question text so teachers can search their question banks
    public function toSearchableArray(): array
    {
        return [
            'id'            => $this->id,
            'question_text' => $this->question_text,
            'exam_title'    => $this->exam?->title,
            'exam_id'       => $this->exam_id,
        ];
    }
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
