import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import App from '../Components/App';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notes from API
    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            setNotes(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load notes on component mount
    useEffect(() => {
        fetchNotes();
    }, []);

    // Handle creating a new note
    const handleCreateNote = async () => {
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    title: 'Untitled Note'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create note');
            }

            const newNote = await response.json();
            // Navigate to editor with the new note
            router.visit(`/editor?id=${newNote.id}`);
        } catch (err) {
            console.error('Error creating note:', err);
            alert('Failed to create note. Please try again.');
        }
    };

    // Handle note click
    const handleNoteClick = (noteId) => {
        router.visit(`/editor?id=${noteId}`);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <App>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                                <p className="mt-2 text-gray-600">Manage your notes and documents</p>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Create New Note</h3>
                                        <p className="text-blue-700 text-sm mb-3">Start writing a new note or document</p>
                                        <button 
                                            onClick={handleCreateNote}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
                                        >
                                            New Note
                                        </button>
                                    </div>
                                    
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h3 className="text-lg font-semibold text-green-900 mb-2">Recent Notes</h3>
                                        <p className="text-green-700 text-sm mb-3">Continue working on recent documents</p>
                                        <span className="text-green-600 text-sm font-medium">
                                            {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
                                        </span>
                                    </div>
                                    
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Assistant</h3>
                                        <p className="text-purple-700 text-sm mb-3">Get help with writing and editing</p>
                                        <span className="text-purple-600 text-sm font-medium">
                                            Try it out in a New Note!
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Notes List */}
                            <div className="bg-white border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
                                </div>
                                
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading notes...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-8 text-center">
                                        <div className="text-red-500 mb-2">
                                            <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-red-600">{error}</p>
                                        <button 
                                            onClick={fetchNotes}
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : notes.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 16a4 4 0 11-8 0 4 4 0 018 0zm-8 8a6 6 0 00-6 6v4h12v-4a6 6 0 00-6-6z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first note.</p>
                                        <div className="mt-6">
                                            <button 
                                                onClick={handleCreateNote}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                                Create your first note
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {notes.map((note) => (
                                            <div 
                                                key={note.id}
                                                onClick={() => handleNoteClick(note.id)}
                                                className="p-6 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                                            {note.title || 'Untitled Note'}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                            {note.content ? 
                                                                note.content.substring(0, 150) + (note.content.length > 150 ? '...' : '') 
                                                                : 'No content yet'
                                                            }
                                                        </p>
                                                        <p className="mt-2 text-xs text-gray-400">
                                                            Last updated: {formatDate(note.updated_at)}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </App>
    );
}