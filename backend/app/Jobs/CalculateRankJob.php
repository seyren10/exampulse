<?php

namespace App\Jobs;

use App\Models\ExamResult;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\Backoff;
use Illuminate\Queue\Attributes\Tries;
use Illuminate\Support\Facades\Log;

#[Tries(3), Backoff(10, 30, 60)]
class CalculateRankJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamResult $examResult)
    {
        $this->onQueue('grading');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $result = $this->examResult->fresh();

        // Get all results for this exam with their sessions
        $allResults = ExamResult::where('exam_id', $result->exam_id)
            ->with('session')
            ->get()
            ->sortByDesc('score')
            ->sortBy(fn($r) => $r->session->submitted_at)
            ->values();

        // Find the rank of current result
        $rank = $allResults->search(function ($r) use ($result) {
            return $r->id === $result->id;
        }) + 1;
        
        // Update result and session with rank
        $result->update(['rank' => $rank]);
        $result->session->update(['rank' => $rank]);

    }

    public function failed(\Throwable $exception): void
    {
        Log::error('CalculateRankJob failed', [
            'result_id' => $this->examResult->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
