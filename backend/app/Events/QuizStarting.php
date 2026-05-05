<?php

namespace App\Events;

use App\Models\LiveQuizSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuizStarting implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public LiveQuizSession $liveQuizSession)
    {
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
        return 'quiz.starting';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => 'Quiz is starting',
            'session_id' => $this->liveQuizSession->id,
            'total_questions' => $this->liveQuizSession->exam->questions()->count(),
        ];
    }
}
