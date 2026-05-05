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

class QuizCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public LiveQuizSession $liveQuizSession,
        public array $finalLeaderboard
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
        return 'quiz.completed';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => 'Quiz has been completed',
            'final_leaderboard' => $this->finalLeaderboard,
        ];
    }
}
