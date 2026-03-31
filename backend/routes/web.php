<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;

Route::get('/', function () {
    return view('welcome');
});

// Fallback for storage images (using 'uploads' prefix to avoid known 'storage' directory issues)
Route::get('/uploads/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    if (file_exists($filePath)) {
        return response()->file($filePath);
    }
    abort(404);
})->where('path', '.*');

// Admin Auth Routes
Route::prefix('admin')->group(function () {
    Route::get('login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
    Route::post('login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::get('register', [AdminAuthController::class, 'showRegister'])->name('admin.register');
    Route::post('register', [AdminAuthController::class, 'register'])->name('admin.register.post');
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
});

// Admin Protected Routes
Route::middleware(['admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/products/create', [AdminController::class, 'createProduct'])->name('admin.products.create');
    Route::post('/products', [AdminController::class, 'storeProduct'])->name('admin.products.store');
    Route::get('/users/create', [AdminController::class, 'createUser'])->name('admin.users.create');
    Route::post('/users', [AdminController::class, 'storeUser'])->name('admin.users.store');
    Route::get('/products/{id}/edit', [AdminController::class, 'editProduct'])->name('admin.products.edit');
    Route::put('/products/{id}', [AdminController::class, 'updateProduct'])->name('admin.products.update');
    Route::get('/orders/create', [AdminController::class, 'createOrder'])->name('admin.orders.create');
    Route::post('/orders', [AdminController::class, 'storeOrder'])->name('admin.orders.store');
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.update-status');
    Route::post('/orders/{id}/complete', [AdminController::class, 'completeOrder'])->name('admin.orders.complete');
    Route::delete('/orders/{id}', [AdminController::class, 'deleteOrder'])->name('admin.delete-order');
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser'])->name('admin.delete-user');
    Route::delete('/locations/{id}', [AdminController::class, 'deleteLocation'])->name('admin.delete-location');
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct'])->name('admin.delete-product');
});
