<?php

namespace App\Jobs;

use App\Models\ExamResult;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\Backoff;
use Illuminate\Queue\Attributes\Tries;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

#[Tries(3), Backoff(10, 30, 60)]
class GenerateCertificateJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamResult $examResult)
    {
        $this->onQueue('default');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $result = $this->examResult->fresh();

        $result->load(['student', 'exam']);

        // Generate simple text certificate (we'll improve this in Phase 9)
        $certificateContent = $this->generateCertificateContent($result);

        // Save to storage
        $filename = "certificates/exam_{$result->exam_id}_student_{$result->student_id}.txt";
        Storage::disk('public')->put($filename, $certificateContent);

        // Update result with certificate path
        $result->update([
            'certificate_path' => $filename,
        ]);
    }

    private function generateCertificateContent(ExamResult $result): string
    {
        return <<<EOT
        ═══════════════════════════════════════════════════════
                        CERTIFICATE OF COMPLETION
        ═══════════════════════════════════════════════════════
        
        This certifies that
        
        {$result->student->name}
        
        Has successfully completed
        
        {$result->exam->title}
        
        Score: {$result->score} / {$result->total_points} ({$result->percentage}%)
        Rank: #{$result->rank}
        
        Date: {$result->created_at->format('F d, Y')}
        
        ═══════════════════════════════════════════════════════
                                ExamPulse
        ═══════════════════════════════════════════════════════
        EOT;
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('GenerateCertificateJob failed', [
            'result_id' => $this->examResult->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
