<?php

namespace App\Enums;

enum LiveQuizSessionStatus: string
{
    case Waiting = 'waiting';
    case Active = 'active';
    case Completed = 'completed';
}
