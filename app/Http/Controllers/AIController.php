<?php

namespace App\Http\Controllers;

use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Exception;

class AIController extends Controller
{
    private OpenAIService $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Enhance note content with AI
     */
    public function enhance(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:10000',
            'action' => 'required|string|in:summarize,improve,tags',
            'stream' => 'boolean'
        ]);

        $content = $request->input('content');
        $action = $request->input('action');
        $stream = $request->input('stream', false);

        try {
            if ($stream) {
                return $this->streamEnhancement($content, $action);
            } else {
                $result = $this->openAIService->enhanceNote($content, $action);
                return response()->json([
                    'success' => true,
                    'content' => $result['choices'][0]['message']['content'] ?? '',
                    'usage' => $result['usage'] ?? null
                ]);
            }
        } catch (Exception $e) {
            Log::error('AI Enhancement Error', [
                'error' => $e->getMessage(),
                'content_length' => strlen($content),
                'action' => $action
            ]);

            return response()->json([
                'success' => false,
                'error' => 'AI enhancement failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Stream AI enhancement response
     */
    private function streamEnhancement(string $content, string $action)
    {
        $prompts = [
            'summarize' => "Please provide a concise summary of the following text:\n\n{$content}",
            'improve' => "Please improve the writing quality, clarity, and structure of the following text while maintaining its original meaning:\n\n{$content}",
            'tags' => "Generate 5-7 relevant tags for the following content. Return only the tags separated by commas:\n\n{$content}"
        ];

        $prompt = $prompts[$action];

        return response()->stream(function () use ($prompt, $action) {
            // Set headers for Server-Sent Events
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('Connection: keep-alive');
            header('X-Accel-Buffering: no'); // Disable nginx buffering

            // Send initial event
            echo "data: " . json_encode(['type' => 'start', 'action' => $action]) . "\n\n";
            flush();

            try {
                $this->openAIService->generateStreamingResponse($prompt, [
                    'max_tokens' => $action === 'tags' ? 100 : 500,
                    'temperature' => $action === 'tags' ? 0.3 : 0.7
                ]);

                // Send completion event
                echo "data: " . json_encode(['type' => 'complete']) . "\n\n";
                flush();
            } catch (Exception $e) {
                // Send error event
                echo "data: " . json_encode([
                    'type' => 'error',
                    'message' => $e->getMessage()
                ]) . "\n\n";
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no'
        ]);
    }

    /**
     * Test AI connection
     */
    public function test()
    {
        try {
            $result = $this->openAIService->testConnection();
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate content suggestions
     */
    public function suggest(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'partial_content' => 'string|max:5000'
        ]);

        $title = $request->input('title');
        $partialContent = $request->input('partial_content', '');

        $prompt = "Based on the title '{$title}'" . 
                 ($partialContent ? " and the following partial content:\n\n{$partialContent}\n\n" : ' ') .
                 "Please suggest 3-5 bullet points or ideas to continue writing this note. Keep suggestions concise and relevant.";

        try {
            $result = $this->openAIService->generateResponse($prompt, [
                'max_tokens' => 300,
                'temperature' => 0.8
            ]);

            return response()->json([
                'success' => true,
                'suggestions' => $result['choices'][0]['message']['content'] ?? '',
                'usage' => $result['usage'] ?? null
            ]);
        } catch (Exception $e) {
            Log::error('AI Suggestion Error', [
                'error' => $e->getMessage(),
                'title' => $title
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to generate suggestions: ' . $e->getMessage()
            ], 500);
        }
    }
}