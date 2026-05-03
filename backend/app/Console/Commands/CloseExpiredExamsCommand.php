<?php

namespace App\Console\Commands;

use App\Enums\ExamSessionStatus;
use App\Events\ExamSubmitted;
use App\Models\ExamSession;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('exam:close-expired')]
#[Description('Auto-submit expired exam sessions')]
class CloseExpiredExamsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredSessions = ExamSession::where('status', ExamSessionStatus::InProgress)
            ->where('expires_at', '<=', now())
            ->get();

        if ($expiredSessions->isEmpty()) {
            $this->info('No expired sessions found.');
            return 0;
        }

        $expiredSessions->each(function ($session) {
            $session->update([
                'submitted_at' => now(),
                'status' => ExamSessionStatus::Submitted,
            ]);

            // Trigger grading
            event(new ExamSubmitted($session));

            $this->info("Closed session ID: {$session->id}");
        });

        $this->info("Closed {$expiredSessions->count()} expired sessions.");
        return 0;
    }
}
