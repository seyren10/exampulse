<?php

namespace App\Jobs;

use App\Mail\ExamResultMail;
use App\Models\ExamResult;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\Backoff;
use Illuminate\Queue\Attributes\Tries;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

#[Tries(3), Backoff(10, 30, 60)]
class SendResultEmailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamResult $examResult)
    {
        $this->onQueue('notifications');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $result = $this->examResult->fresh();
        $result->load(['student', 'exam']);

        Mail::to($result->student->email)->send(new ExamResultMail($result));

        // Mark email as sent
        $result->update(['email_sent' => true]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('SentResultEmailJob failed', [
            'result_id' => $this->examResult->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
