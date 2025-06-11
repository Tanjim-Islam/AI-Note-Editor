<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl = 'https://api.openai.com/v1';

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
        $this->model = config('services.openai.model', 'gpt-4.1-nano-2025-04-14');
        
        if (empty($this->apiKey)) {
            throw new Exception('OpenAI API key is not configured');
        }
    }

    /**
     * Generate AI response with streaming support
     */
    public function generateResponse(string $prompt, array $options = []): array
    {
        $stream = $options['stream'] ?? false;
        $maxTokens = $options['max_tokens'] ?? 500;
        $temperature = $options['temperature'] ?? 0.7;

        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => $maxTokens,
            'temperature' => $temperature,
            'stream' => $stream
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => false, // Disable SSL verification for local development
            ])->timeout(30)->post($this->baseUrl . '/chat/completions', $payload);

            if (!$response->successful()) {
                Log::error('OpenAI API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('OpenAI API request failed: ' . $response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('OpenAI Service Error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Generate streaming response for real-time AI interaction
     */
    public function generateStreamingResponse(string $prompt, array $options = []): \Generator
    {
        $maxTokens = $options['max_tokens'] ?? 500;
        $temperature = $options['temperature'] ?? 0.7;

        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => $maxTokens,
            'temperature' => $temperature,
            'stream' => true
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . '/chat/completions',
            CURLOPT_RETURNTRANSFER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_SSL_VERIFYPEER => false, // Disable SSL verification for local development
            CURLOPT_SSL_VERIFYHOST => false, // Disable SSL host verification for local development
            CURLOPT_WRITEFUNCTION => function($ch, $data) {
                static $buffer = '';
                $buffer .= $data;
                
                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    
                    if (strpos($line, 'data: ') === 0) {
                        $jsonData = substr($line, 6);
                        if (trim($jsonData) === '[DONE]') {
                            return strlen($data);
                        }
                        
                        $decoded = json_decode($jsonData, true);
                        if ($decoded && isset($decoded['choices'][0]['delta']['content'])) {
                            echo "data: " . json_encode([
                                'content' => $decoded['choices'][0]['delta']['content']
                            ]) . "\n\n";
                            flush();
                        }
                    }
                }
                
                return strlen($data);
            }
        ]);

        curl_exec($ch);
        curl_close($ch);
        
        // This method is declared as Generator but needs at least one yield
        // Since we're using echo for streaming, we yield nothing but satisfy the return type
        yield;
    }

    /**
     * Enhance note content with AI
     */
    public function enhanceNote(string $content, string $action): array
    {
        $prompts = [
            'summarize' => "Please provide a concise summary of the following text:\n\n{$content}",
            'improve' => "Please improve the writing quality, clarity, and structure of the following text while maintaining its original meaning:\n\n{$content}",
            'tags' => "Generate 5-7 relevant tags for the following content. Return only the tags separated by commas:\n\n{$content}"
        ];

        if (!isset($prompts[$action])) {
            throw new Exception('Invalid enhancement action');
        }

        return $this->generateResponse($prompts[$action], [
            'max_tokens' => $action === 'tags' ? 100 : 500,
            'temperature' => $action === 'tags' ? 0.3 : 0.7
        ]);
    }

    /**
     * Test the OpenAI connection
     */
    public function testConnection(): array
    {
        try {
            $response = $this->generateResponse('Hello! This is a test message. Please respond with "API connection successful!"', [
                'max_tokens' => 50,
                'temperature' => 0.1
            ]);
            
            return [
                'success' => true,
                'message' => $response['choices'][0]['message']['content'] ?? 'No response content',
                'usage' => $response['usage'] ?? null
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}