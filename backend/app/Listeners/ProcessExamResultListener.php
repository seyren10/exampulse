<?php

namespace App\Listeners;

use App\Events\ExamGraded;
use App\Jobs\CalculateRankJob;
use App\Jobs\GenerateCertificateJob;
use App\Jobs\SendResultEmailJob;
use App\Notifications\ExamGradedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Bus;

class ProcessExamResultListener
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
    public function handle(ExamGraded $event): void
    {
        $result = $event->examResult;
        $result->load('student');
        $result->student->notify(new ExamGradedNotification($result));
        
        Bus::chain([
            new CalculateRankJob($event->examResult),
            new GenerateCertificateJob($event->examResult),
            new SendResultEmailJob($event->examResult),
        ])->dispatch();
    }
}
