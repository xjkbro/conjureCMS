<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/posts', [PostController::class, 'allPosts']);
Route::get('/posts/id/{id}', [PostController::class, 'postById']);
Route::get('/posts/slug/{slug}', [PostController::class, 'postBySlug']);
Route::get('/user/{id}/posts', [PostController::class, 'postsByUser']);
Route::get('/category/{id}/posts', [PostController::class, 'postsByCategory']);

Route::get('/user/{id}', [Controller::class, 'getUserItems']);

