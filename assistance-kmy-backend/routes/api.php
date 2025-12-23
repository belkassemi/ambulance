<?php

use App\Http\Controllers\DemandeController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password as PasswordRule;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/demande-anonyme', [DemandeController::class, 'storeAnonyme']);

// Forgot Password - Send Reset Link Email
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json([
            'success' => true,
            'message' => 'Un lien de réinitialisation a été envoyé à votre adresse email.',
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Aucun utilisateur trouvé avec cet email.',
    ], 404);
})->name('password.email');

// Reset Password - Update Password
Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => ['required', 'confirmed', PasswordRule::min(8)],
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->save();
        }
    );

    if ($status === Password::PASSWORD_RESET) {
        return response()->json([
            'success' => true,
            'message' => 'Votre mot de passe a été réinitialisé avec succès.',
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Le lien de réinitialisation est invalide ou a expiré.',
    ], 400);
})->name('password.update');


// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    });

    // Demande routes
    Route::get('/demandes', [DemandeController::class, 'index']);
    Route::post('/demande', [DemandeController::class, 'store']);
    Route::get('/demandes/{id}', [DemandeController::class, 'show']);
    Route::patch('/demandes/{id}/status', [DemandeController::class, 'updateStatus']);
    Route::delete('/demandes/{id}', [DemandeController::class, 'destroy']);
});
