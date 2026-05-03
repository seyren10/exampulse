<?php

use App\Http\Controllers\Api\V1\ClassroomController;
use App\Http\Controllers\Api\V1\ExamController;
use App\Http\Controllers\Api\V1\ExamSessionController;
use App\Http\Controllers\Api\V1\QuestionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });

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
});
