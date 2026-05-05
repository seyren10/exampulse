<?php

namespace App\Notifications;

use App\Models\ExamResult;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExamGradedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public ExamResult $result)
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
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Exam Graded',
            'message' => "Your exam '{$this->result->exam->title}' has been graded!",
            'exam_id' => $this->result->exam_id,
            'result_id' => $this->result->id,
            'score' => $this->result->score,
            'total_points' => $this->result->total_points,
            'percentage' => $this->result->percentage,
            'rank' => $this->result->rank,
        ];
    }
}
