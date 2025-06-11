<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        \Log::info('Starting Google OAuth callback');
        
        try {
            // Configure Guzzle to ignore SSL verification for local development
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new \GuzzleHttp\Client([
                    'verify' => false, // Disable SSL verification for local development
                    'timeout' => 30
                ]))
                ->user();
            
            \Log::info('Google user data retrieved', ['email' => $googleUser->getEmail()]);
            
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]
            );
            
            \Log::info('User found/created', ['user_id' => $user->id]);
            
            Auth::login($user);
            \Log::info('User logged in successfully');
            
            return redirect('/dashboard');
        } catch (\Exception $e) {
            \Log::error('OAuth callback failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect('/login')->with('error', 'Authentication failed');
        }
    }

    /**
     * Logout user
     */
    public function logout()
    {
        Auth::logout();
        return redirect('/login');
    }
}
