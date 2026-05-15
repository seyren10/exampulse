<?php

namespace App\Models;

use App\Models\Exam;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'teacher_id',
    'name',
    'description',
    'is_active',
])]

class Classroom extends Model
{

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Classroom $classroom) {
            $classroom->code = Str::random(8);
        });
    }
    
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'classroom_student', 'classroom_id', 'student_id')
            ->using(ClassroomStudent::class)
            ->withTimestamps()
            ->withPivot('joined_at');
    }


    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }
}
