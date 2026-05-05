<?php

namespace App\Models;

use App\Enums\ExamType;
use App\Models\Classroom;
use App\Models\Question;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

#[Fillable([
    'classroom_id',
    'title',
    'description',
    'type',
    'time_limit',
    'scheduled_at',
    'deadline',
    'is_published',
])]
class Exam extends Model
{
    use Searchable;



    protected function casts(): array
    {
        return [
            'type' => ExamType::class,
            'scheduled_at' => 'datetime',
            'deadline' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    // Defines the Meilisearch document shape for this model
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'classroom' => $this->classroom?->name,
            'teacher' => $this->classroom?->teacher?->name,
        ];
    }

    // Only index published exams
    public function shouldBeSearchable(): bool
    {
        return (bool) $this->is_published;
    }


    // Relationships
    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    // Helper: Check if exam is live type
    public function isLive(): bool
    {
        return $this->type === ExamType::Live;
    }

    // Helper: Check if exam is async type
    public function isAsync(): bool
    {
        return $this->type === ExamType::Async;
    }
}
