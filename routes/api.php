<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\NoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'web'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/notes', [NoteController::class, 'index']);
    Route::get('/notes/{id}', [NoteController::class, 'show']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::patch('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);
    
    // AI Enhancement Routes
    Route::post('/ai/enhance', [AIController::class, 'enhance']);
    Route::get('/ai/enhance', [AIController::class, 'enhance']); // For streaming requests
    Route::post('/ai/suggest', [AIController::class, 'suggest']);
    Route::get('/ai/test', [AIController::class, 'test']);
});