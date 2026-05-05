<?php

namespace App\Notifications;

use App\Models\Exam;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExamReminderNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Exam $exam)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $scheduledTime = $this->exam->scheduled_at->format('F j, Y g:i A');

        return (new MailMessage)
            ->subject('Exam Reminder: ' . $this->exam->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a reminder that you have an upcoming exam:')
            ->line('**' . $this->exam->title . '**')
            ->line('Scheduled for: ' . $scheduledTime)
            ->action('View Exam', url('/exams/' . $this->exam->id))
            ->line('Good luck!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Upcoming Exam',
            'message' => "Reminder: '{$this->exam->title}' is scheduled for " . $this->exam->scheduled_at->format('M j, g:i A'),
            'exam_id' => $this->exam->id,
            'scheduled_at' => $this->exam->scheduled_at->toISOString(),
        ];
    }
}
