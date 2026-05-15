<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Table('classroom_student')]
class ClassroomStudent extends Pivot
{

    protected function casts()
    {
        return [
            'joined_at' => 'datetime'
        ];
    }
}
