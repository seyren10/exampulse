<?php

use App\Http\Controllers\Api\V1\ClassroomController;
use App\Http\Controllers\Api\V1\ExamController;
use App\Http\Controllers\Api\V1\ExamSessionController;
use App\Http\Controllers\Api\V1\LiveQuizController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\QuestionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Classrooms
    Route::apiResource('classrooms', ClassroomController::class);
    Route::post('classrooms/join', [ClassroomController::class, 'join']);

    // Exams (nested under classrooms)
    Route::apiResource('classrooms.exams', ExamController::class)->shallow();

    // Questions (nested under exams)
    Route::apiResource('exams.questions', QuestionController::class)
        ->except(['index', 'show'])
        ->shallow();

    // Exam Sessions (students only)
    Route::middleware('role:student')->group(function () {
        Route::post('exams/{exam}/session/start', [ExamSessionController::class, 'start']);

        Route::prefix('sessions/{session}')->group(function () {
            Route::post('answer', [ExamSessionController::class, 'submitAnswer']);
            Route::post('submit', [ExamSessionController::class, 'submit']);
            Route::get('result', [ExamSessionController::class, 'result']);
        });
    });

    // Live Quiz (teacher creates, students join)
    Route::prefix('live-quiz')->group(function () {
        // Teacher routes
        Route::post('exams/{exam}/create', [LiveQuizController::class, 'create'])->middleware('role:teacher');

        Route::prefix('sessions/{session}')->group(function () {
            Route::post('start', [LiveQuizController::class, 'start']);
            Route::post('next-question', [LiveQuizController::class, 'nextQuestion']);
            Route::post('reveal-answer', [LiveQuizController::class, 'revealAnswer']);
            Route::post('end', [LiveQuizController::class, 'end']);
        })->middleware('role:teacher');

        // Student routes
        Route::middleware('role:student')->group(function () {
            Route::post('join', [LiveQuizController::class, 'join']);
            Route::post('sessions/{session}/answer', [LiveQuizController::class, 'submitAnswer']);
        });

        // Shared
        Route::get('sessions/{session}/leaderboard', [LiveQuizController::class, 'leaderboard']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('{notification}', [NotificationController::class, 'destroy']);
    });
});
