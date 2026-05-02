<?php

use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\QuestionController;
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
});
