import React, { useState } from 'react';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';

const AIEnhancer = ({ noteContent, onApplyResult, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [activeAction, setActiveAction] = useState(null);
    const [streamingContent, setStreamingContent] = useState('');

    const actions = [
        {
            id: 'summarize',
            label: 'Summarize',
            description: 'Create a concise summary of your note',
            icon: '📝'
        },
        {
            id: 'improve',
            label: 'Improve Writing',
            description: 'Enhance clarity and structure',
            icon: '✨'
        },
        {
            id: 'tags',
            label: 'Generate Tags',
            description: 'Create relevant tags for organization',
            icon: '🏷️'
        }
    ];

    const handleAction = async (action) => {
        if (!noteContent.trim()) {
            setError('Please add some content to your note first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult('');
        setStreamingContent('');
        setActiveAction(action);

        try {
            // Try streaming first
            const eventSource = new EventSource(
                `/api/ai/enhance?content=${encodeURIComponent(noteContent)}&action=${action.id}&stream=true`,
                {
                    headers: {
                        'Accept': 'text/event-stream',
                        'Cache-Control': 'no-cache'
                    }
                }
            );

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'start') {
                        setStreamingContent('');
                    } else if (data.content) {
                        setStreamingContent(prev => prev + data.content);
                    } else if (data.type === 'complete') {
                        setResult(streamingContent);
                        setIsLoading(false);
                        eventSource.close();
                    } else if (data.type === 'error') {
                        throw new Error(data.message);
                    }
                } catch (parseError) {
                    console.error('Error parsing SSE data:', parseError);
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE Error:', error);
                eventSource.close();
                // Fallback to regular API call
                fallbackToRegularAPI(action);
            };

            // Timeout after 30 seconds
            setTimeout(() => {
                if (eventSource.readyState !== EventSource.CLOSED) {
                    eventSource.close();
                    fallbackToRegularAPI(action);
                }
            }, 30000);

        } catch (error) {
            console.error('Streaming error:', error);
            fallbackToRegularAPI(action);
        }
    };

    const fallbackToRegularAPI = async (action) => {
        try {
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    content: noteContent,
                    action: action.id,
                    stream: false
                })
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.content);
                setStreamingContent('');
            } else {
                throw new Error(data.error || 'AI enhancement failed');
            }
        } catch (error) {
            console.error('API Error:', error);
            setError(error.message || 'Failed to enhance content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyResult = () => {
        const contentToApply = result || streamingContent;
        if (contentToApply && onApplyResult) {
            onApplyResult(contentToApply, activeAction);
            setResult('');
            setStreamingContent('');
            setIsOpen(false);
        }
    };

    const handleClearResult = () => {
        setResult('');
        setStreamingContent('');
        setError('');
        setActiveAction(null);
    };

    return (
        <div className="relative">
            {/* AI Enhancer Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                    ${disabled 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg'
                    }
                `}
            >
                <SparklesIcon className="w-4 h-4" />
                <span className="font-medium">AI Enhance</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Enhancement Options</h3>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2 mb-4">
                            {actions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleAction(action)}
                                    disabled={isLoading}
                                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{action.icon}</span>
                                        <div>
                                            <div className="font-medium text-gray-800">{action.label}</div>
                                            <div className="text-sm text-gray-600">{action.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    <span className="text-blue-700 font-medium">
                                        {activeAction ? `${activeAction.label === 'Improve Writing' ? 'Improving Writing' : activeAction.label + 'ing'}...` : 'Processing...'}
                                    </span>
                                </div>
                                {streamingContent && (
                                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                        {streamingContent}
                                        <span className="animate-pulse">|</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="text-red-700 text-sm">{error}</div>
                            </div>
                        )}

                        {/* Result Display */}
                        {(result || (!isLoading && streamingContent)) && (
                            <div className="mb-4">
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {activeAction?.label} Result:
                                        </span>
                                        <button
                                            onClick={handleClearResult}
                                            className="text-gray-400 hover:text-gray-600 text-sm"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                        {result || streamingContent}
                                    </div>
                                </div>
                                
                                {/* Apply Button */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleApplyResult}
                                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                    >
                                        Apply to Note
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Close Button (when no result) */}
                        {!result && !streamingContent && !isLoading && (
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIEnhancer;