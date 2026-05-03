<?php

namespace App\Listeners;

use App\Events\ExamGraded;
use App\Jobs\CalculateRankJob;
use App\Jobs\GenerateCertificateJob;
use App\Jobs\SentResultEmailJob;
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
        Bus::chain([
            new CalculateRankJob($event->examResult),
            new GenerateCertificateJob($event->examResult),
            new SentResultEmailJob($event->examResult),
        ])->dispatch();
    }
}
