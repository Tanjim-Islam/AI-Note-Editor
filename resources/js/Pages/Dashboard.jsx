import { Head } from '@inertiajs/react';
import App from '../Components/App';

export default function Dashboard() {
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
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
                                            New Note
                                        </button>
                                    </div>
                                    
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h3 className="text-lg font-semibold text-green-900 mb-2">Recent Notes</h3>
                                        <p className="text-green-700 text-sm mb-3">Continue working on recent documents</p>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-150 ease-in-out">
                                            View Recent
                                        </button>
                                    </div>
                                    
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Assistant</h3>
                                        <p className="text-purple-700 text-sm mb-3">Get help with writing and editing</p>
                                        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-150 ease-in-out">
                                            AI Help
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Notes List Placeholder */}
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 16a4 4 0 11-8 0 4 4 0 018 0zm-8 8a6 6 0 00-6 6v4h12v-4a6 6 0 00-6-6z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first note.</p>
                                    <div className="mt-6">
                                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Create your first note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </App>
    );
}