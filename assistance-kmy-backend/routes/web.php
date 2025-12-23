<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Password Reset Routes
Route::get('/reset-password/{token}', function (string $token) {
    return view('auth.reset-password', [
        'token' => $token,
        'email' => request()->query('email')
    ]);
})->middleware('guest')->name('password.reset');

Route::get('/password-reset-success', function () {
    return view('auth.password-reset-success');
})->name('password.reset.success');
