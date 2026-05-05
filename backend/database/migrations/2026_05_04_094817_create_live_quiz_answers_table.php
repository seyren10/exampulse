<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('live_quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('live_quiz_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('live_quiz_participants')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->foreignId('selected_option_id')->nullable()->constrained('options')->onDelete('set null');
            $table->boolean('is_correct')->default(false);
            $table->integer('points_earned')->default(0);
            $table->integer('time_taken')->default(0)->comment('Time taken in milliseconds');
            $table->timestamps();

            $table->unique(['live_quiz_session_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_quiz_answers');
    }
};
