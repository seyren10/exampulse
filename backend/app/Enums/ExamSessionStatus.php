<?php

namespace App\Enums;

enum ExamSessionStatus: string
{
    case InProgress = 'in_progress';
    case Submitted = 'submitted';
    case Expired = 'expired';
    case Graded = 'graded';
}
