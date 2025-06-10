'use client'

import { useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, requireAuth } = useAuth();

    useEffect(() => {
        requireAuth();
    }, [isAuthenticated, isLoading]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-blue mx-auto mb-4"></div>
                    <p className="text-main-blue font-medium">Vérification de l&apos;authentification...</p>
                </div>
            </div>
        );
    }

    // Only render children if authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-main-blue font-medium">Redirection vers la page de connexion...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}