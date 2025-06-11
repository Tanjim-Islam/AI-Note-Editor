import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl text-center font-bold text-gray-900 mb-4">
                        Welcome to Notes AI
                    </h1>
                    <p className="text-gray-600 mb-6">
                        This is a Notes App that has AI functionalities!
                    </p>
                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}