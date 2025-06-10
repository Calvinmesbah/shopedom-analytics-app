'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: { email: string } | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null
    });
    const router = useRouter();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/verify-user', {
                method: 'GET',
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data = await response.json();
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: data.user
                });
            } else {
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null
                });
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null
            });
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: { email }
                });
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Une erreur s\'est produite. Veuillez réessayer.' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null
            });
            router.push('/login');
        }
    };

    const requireAuth = () => {
        if (!authState.isLoading && !authState.isAuthenticated) {
            router.push('/login');
        }
    };

    return {
        ...authState,
        login,
        logout,
        requireAuth,
        checkAuthStatus
    };
}