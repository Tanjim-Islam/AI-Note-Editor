<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;
use Laravel\Socialite\Two\InvalidStateException;

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
        try {
            // Handle invalid state exception specifically and SSL issues in local development
            $socialiteDriver = Socialite::driver('google')->stateless();
            
            // Disable SSL verification for local development
            if (app()->environment('local')) {
                $socialiteDriver->setHttpClient(
                    new \GuzzleHttp\Client([
                        'verify' => false,
                        'timeout' => 30
                    ])
                );
            }
            
            $googleUser = $socialiteDriver->user();
            
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]
            );
            
            Auth::login($user, true); // Remember the user
            
            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'session_id' => session()->getId(),
                'auth_check' => Auth::check()
            ]);
            
            // Force session regeneration
            request()->session()->regenerate();
            
            return redirect()->intended('/dashboard');
        } catch (InvalidStateException $e) {
            Log::error('Invalid state exception during OAuth', ['error' => $e->getMessage()]);
            // Clear any existing session data and redirect to start fresh
            session()->flush();
            return redirect('/login')->with('error', 'Authentication session expired. Please try again.');
        } catch (Exception $e) {
            Log::error('Google OAuth failed', ['error' => $e->getMessage()]);
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
