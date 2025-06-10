// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Get credentials from environment variables
        const validEmail = process.env.ADMIN_EMAIL;
        const validPassword = process.env.ADMIN_PASSWORD;

        // Check if environment variables are set
        if (!validEmail || !validPassword) {
            console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables');
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Validate credentials
        if (email === validEmail && password === validPassword) {
            // Create response
            const response = NextResponse.json(
                { message: 'Login successful', success: true },
                { status: 200 }
            );

            // Set authentication cookie (optional - for session management)
            response.cookies.set('auth-token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return response;
        } else {
            // Invalid credentials
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}