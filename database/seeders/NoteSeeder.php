<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user if none exists
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'google_id' => 'test_google_id',
            ]);
        }

        // Create test notes for the user
        Note::create([
            'title' => 'My First Note',
            'content' => 'This is the content of my first note. It contains some sample text to test the note functionality.',
            'user_id' => $user->id,
        ]);

        Note::create([
            'title' => 'Meeting Notes',
            'content' => 'Meeting with team about project progress:\n- Discussed current status\n- Planned next steps\n- Assigned tasks',
            'user_id' => $user->id,
        ]);
    }
}
