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
        // Configure Guzzle client with proper SSL certificate for local development
        $guzzleConfig = [];
        if (app()->environment('local')) {
            $certPath = base_path('cacert.pem');
            if (file_exists($certPath)) {
                $guzzleConfig['verify'] = $certPath;
            }
        }
        
        // Create Guzzle client with SSL configuration
        $guzzleClient = new \GuzzleHttp\Client($guzzleConfig);
        
        // Configure Socialite to use our Guzzle client
        $socialiteDriver = Socialite::driver('google');
        
        // Use reflection to set the HTTP client since there's no public method
        $reflection = new \ReflectionClass($socialiteDriver);
        $httpClientProperty = $reflection->getProperty('httpClient');
        $httpClientProperty->setAccessible(true);
        $httpClientProperty->setValue($socialiteDriver, $guzzleClient);
        
        return $socialiteDriver->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            // Configure Guzzle client with proper SSL certificate for local development
            $guzzleConfig = [];
            if (app()->environment('local')) {
                $certPath = base_path('cacert.pem');
                if (file_exists($certPath)) {
                    $guzzleConfig['verify'] = $certPath;
                }
            }
            
            // Create Guzzle client with SSL configuration
            $guzzleClient = new \GuzzleHttp\Client($guzzleConfig);
            
            // Configure Socialite to use our Guzzle client
            $socialiteDriver = Socialite::driver('google');
            
            // Use reflection to set the HTTP client since there's no public method
            $reflection = new \ReflectionClass($socialiteDriver);
            $httpClientProperty = $reflection->getProperty('httpClient');
            $httpClientProperty->setAccessible(true);
            $httpClientProperty->setValue($socialiteDriver, $guzzleClient);
            
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
