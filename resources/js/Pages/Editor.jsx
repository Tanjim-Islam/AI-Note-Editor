import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import App from '../Components/App';
import AIEnhancer from '../Components/AIEnhancer';

export default function Editor() {
    const [noteId, setNoteId] = useState(null);
    const [title, setTitle] = useState('Untitled Note');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSaved, setLastSaved] = useState(null);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [wasAutoSaved, setWasAutoSaved] = useState(false);

    // Get note ID from URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            setNoteId(id);
            loadNote(id);
        } else {
            setIsLoading(false);
        }
    }, []);

    // Load note from API
    const loadNote = async (id) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/notes/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to load note');
            }

            const note = await response.json();
            setTitle(note.title || 'Untitled Note');
            setContent(note.content || '');
            setLastSaved(new Date(note.updated_at));
        } catch (err) {
            setError(err.message);
            console.error('Error loading note:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Save note to API
    const handleSave = async (isAutoSave = false) => {
        if (!noteId) {
            if (!isAutoSave) {
                alert('Cannot save note: No note ID found');
            }
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save note');
            }

            setLastSaved(new Date());
            setWasAutoSaved(isAutoSave);
        } catch (err) {
            console.error('Error saving note:', err);
            if (!isAutoSave) {
                alert('Failed to save note. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Delete note
    const handleDelete = async () => {
        if (!noteId) {
            alert('Cannot delete note: No note ID found');
            return;
        }

        if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to delete note');
            }

            // Navigate back to dashboard
            router.visit('/dashboard');
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note. Please try again.');
        }
    };

    const handleAIResult = (result, action) => {
        if (action.id === 'tags') {
            // For tags, append to the end of the content
            setContent(prevContent => {
                const separator = prevContent.trim() ? '\n\n' : '';
                return prevContent + separator + '**Tags:** ' + result;
            });
        } else {
            // For summarize and improve, replace the content
            setContent(result);
        }
        
        // Auto-save after applying AI result
        setTimeout(() => {
            handleSave(true);
        }, 500);
    };

    // Auto-save functionality
    useEffect(() => {
        if (!noteId || isLoading || isDeleting) return;

        const autoSaveTimer = setTimeout(() => {
            handleSave(true); // Pass true to indicate this is an auto-save
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(autoSaveTimer);
    }, [title, content, noteId, isLoading, isDeleting]);

    const formatLastSaved = (date, wasAuto) => {
        if (!date) return 'Never saved';
        const prefix = wasAuto ? 'Auto-saved at' : 'Last saved at';
        return `${prefix} ${date.toLocaleTimeString()}`;
    };

    // Show loading state
    if (isLoading) {
        return (
            <App>
                <Head title="Loading..." />
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading note...</p>
                    </div>
                </div>
            </App>
        );
    }

    // Show error state
    if (error) {
        return (
            <App>
                <Head title="Error" />
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Note</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => router.visit('/dashboard')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </App>
        );
    }

    return (
        <App>
            <Head title={title || 'Editor'} />
            <div className="h-screen flex flex-col">
                {/* Editor Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.visit('/dashboard')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex-1 min-w-0">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-2xl font-bold text-gray-900 border-none outline-none bg-transparent w-full focus:ring-0 p-0"
                                    placeholder="Enter note title..."
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {formatLastSaved(lastSaved, wasAutoSaved)}
                            </div>
                            <button
                                onClick={() => {
                                    handleSave(false); // Manual save
                                    setWasAutoSaved(false); // Reset auto-save flag for manual saves
                                }}
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 flex">
                    {/* Main Editor */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 p-6">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full resize-none border-none outline-none text-gray-900 text-lg leading-relaxed focus:ring-0"
                                placeholder="Start writing your note..."
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
                        <div className="space-y-6">
                            {/* Document Info */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Document Info</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Words:</span>
                                        <span>{content.split(/\s+/).filter(word => word.length > 0).length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Characters:</span>
                                        <span>{content.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Lines:</span>
                                        <span>{content.split('\n').length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Tools */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">AI Tools</h3>
                                <AIEnhancer 
                                    noteContent={content}
                                    onApplyResult={handleAIResult}
                                    disabled={!content.trim() || isSaving}
                                />
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
                                        📤 Export
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
                                        📋 Copy to Clipboard
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition duration-150 ease-in-out"
                                    >
                                        🗑️ Delete Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </App>
    );
}