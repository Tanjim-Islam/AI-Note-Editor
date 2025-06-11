import { Head } from '@inertiajs/react';
import { useState } from 'react';
import App from '../Components/App';

export default function Editor() {
    const [title, setTitle] = useState('Untitled Note');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement actual save functionality with API call
        setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date());
        }, 1000);
    };

    const formatLastSaved = (date) => {
        if (!date) return 'Never saved';
        return `Last saved at ${date.toLocaleTimeString()}`;
    };

    return (
        <App>
            <Head title="Editor" />
            <div className="h-screen flex flex-col">
                {/* Editor Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-2xl font-bold text-gray-900 border-none outline-none bg-transparent w-full focus:ring-0 p-0"
                                placeholder="Enter note title..."
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {formatLastSaved(lastSaved)}
                            </div>
                            <button
                                onClick={handleSave}
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
                                <div className="space-y-2">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
                                        📝 Improve Writing
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
                                        📋 Summarize
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
                                        🏷️ Generate Tags
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
                                        🔍 Find Similar
                                    </button>
                                </div>
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
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
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