import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

// Avatar component with proper fallback handling
const AvatarWithFallback = ({ user, size, textSize }) => {
    const [imageError, setImageError] = useState(false)
    
    // Debug logging
    console.log('AvatarWithFallback - user:', user)
    console.log('AvatarWithFallback - user.avatar:', user.avatar)
    console.log('AvatarWithFallback - imageError:', imageError)
    
    // Check if avatar exists and is a valid URL
    const hasValidAvatar = user.avatar && typeof user.avatar === 'string' && user.avatar.trim() !== ''
    
    if (!hasValidAvatar || imageError) {
        return (
            <div className={`${size} rounded-full bg-gray-300 flex items-center justify-center border border-gray-200`}>
                <span className={`${textSize} font-medium text-gray-600`}>
                    {user.name?.charAt(0)?.toUpperCase()}
                </span>
            </div>
        )
    }
    
    return (
        <img
            className={`${size} rounded-full object-cover border border-gray-200`}
            src={user.avatar}
            alt={user.name}
            onError={(e) => {
                console.log('Image load error:', e, 'URL:', user.avatar)
                setImageError(true)
            }}
            onLoad={() => {
                console.log('Image loaded successfully:', user.avatar)
            }}
        />
    )
};

export default function App({ children }) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        // Use a form to submit logout request
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        
        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head>
                <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
            </Head>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                {/* Logo */}
                                <div className="flex-shrink-0">
                                    <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                                        Notes AI
                                    </Link>
                                </div>
                                
                                {/* Navigation Links */}
                                {auth?.user && (
                                    <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                        <Link
                                            href="/dashboard"
                                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out inline-flex items-center"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/editor"
                                            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out inline-flex items-center"
                                        >
                                            Editor
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {/* User Menu */}
                            {auth?.user && (
                                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-3">
                                            <AvatarWithFallback 
                                                user={auth.user} 
                                                size="h-8 w-8" 
                                                textSize="text-sm" 
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {auth.user.name}
                                            </span>
                                        </div>
                                        <div className="h-6 w-px bg-gray-300"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition duration-150 ease-in-out px-2 py-1 rounded hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Mobile menu button */}
                            {auth?.user && (
                                <div className="sm:hidden flex items-center">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                    >
                                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Mobile menu */}
                    {auth?.user && isMobileMenuOpen && (
                        <div className="sm:hidden">
                            <div className="pt-2 pb-3 space-y-1">
                                <Link
                                    href="/dashboard"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/editor"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                >
                                    Editor
                                </Link>
                            </div>
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="flex items-center px-4">
                                    <AvatarWithFallback 
                                         user={auth.user} 
                                         size="h-10 w-10" 
                                         textSize="text-lg" 
                                     />
                                    <div className="ml-3 flex-1">
                                        <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{auth.user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left transition duration-150 ease-in-out"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
                
                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </>
    );
}