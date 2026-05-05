<?php

namespace App\Events;

use App\Models\LiveQuizSession;
use App\Models\Question;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuestionPushed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public LiveQuizSession $liveQuizSession,
        public Question $question,
        public int $questionNumber
    ) {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("quiz.{$this->liveQuizSession->room_code}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'question.pushed';
    }

    public function broadcastWith(): array
    {
        return [
            'question' => [
                'id' => $this->question->id,
                'question_text' => $this->question->question_text,
                'image_path' => $this->question->image_path,
                'points' => $this->question->points,
                'options' => $this->question->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                        'order' => $option->order,
                        // Don't send is_correct to students!
                    ];
                }),
            ],
            'question_number' => $this->questionNumber,
            'total_questions' => $this->liveQuizSession->exam->questions()->count(),
        ];
    }
}
