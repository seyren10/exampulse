<?php

namespace App\Listeners;

use App\Events\ExamSubmitted;
use App\Jobs\GradeExamJob;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class GradeExamListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ExamSubmitted $event): void
    {
        GradeExamJob::dispatch($event->examSession);
    }
}
