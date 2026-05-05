<?php

namespace App\Console\Commands;

use App\Enums\ExamType;
use App\Models\Exam;
use App\Models\User;
use App\Notifications\ExamReminderNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('exam:notify-students')]
#[Description('Send reminders for exams starting in 30 minutes')]
class NotifyUpcomingExamsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find exams scheduled to start in 25-35 minutes (gives 10-min window)
        $upcomingExams = Exam::where('type', ExamType::Async)
            ->where('is_published', true)
            ->whereBetween('scheduled_at', [
                now()->addMinutes(25),
                now()->addMinutes(35),
            ])
            ->with(['classroom.students'])
            ->get();

        if ($upcomingExams->isEmpty()) {
            $this->info('No upcoming exams in the next 30 minutes.');
            return 0;
        }

        /**
         * @var Exam $exam
         */
        foreach ($upcomingExams as $exam) {
            // Get enrolled students
            $students = $exam->classroom->students;

            /**
             * @var User $student
             */
            foreach ($students as $student) {
                $student->notify(new ExamReminderNotification($exam));
            }

            $this->info("Sent reminders for: {$exam->title} ({$students->count()} students)");
        }

        $this->info("Processed {$upcomingExams->count()} exams.");
        return 0;
    }
}
