<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $notes = Note::where('user_id', $request->user()->id)
                    ->orderBy('updated_at', 'desc')
                    ->get();

        return response()->json($notes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $note = Note::create([
            'title' => $request->title,
            'user_id' => $request->user()->id,
            'content' => '',
        ]);

        return response()->json($note, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $note = Note::where('user_id', $request->user()->id)
                   ->findOrFail($id);

        return response()->json($note);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== $request->user()->id) {
            abort(403);
        }

        $note->update($request->only(['title', 'content']));

        return response()->json(['status' => 'updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== $request->user()->id) {
            abort(403);
        }

        $note->delete();

        return response()->json(['status' => 'deleted']);
    }

    /**
     * Get word count for text using raw PHP service.
     */
    public function getWordCount(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        $text = $request->input('text');
        
        // Call the raw PHP word count service
        $url = url('/raw-php/word_count.php');
        
        $postData = json_encode(['text' => $text]);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($postData)
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            return response()->json(['error' => 'Failed to connect to word count service: ' . $error], 500);
        }
        
        if ($httpCode !== 200) {
            return response()->json(['error' => 'Word count service returned error'], 500);
        }
        
        $result = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid response from word count service'], 500);
        }
        
        return response()->json($result);
    }
}
