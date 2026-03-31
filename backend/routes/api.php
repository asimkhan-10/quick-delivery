<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;

use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Public Routes
Route::get('/home', [ProductController::class, 'getHomeData']);
Route::get('/products/{id}', [ProductController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'store']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'destroy']);
    Route::post('/orders/place', [OrderController::class, 'placeOrder']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/{id}/confirm', [OrderController::class, 'confirmDelivery']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/locations/add', [ProfileController::class, 'addLocation']);
});
