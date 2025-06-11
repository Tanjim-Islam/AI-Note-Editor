import React from 'react';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Welcome to Notes AI
                    </h1>
                    <p className="text-gray-600">
                        Inertia.js with React is successfully configured!
                    </p>
                </div>
            </div>
        </>
    );
}