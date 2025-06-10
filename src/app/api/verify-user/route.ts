import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const authToken = (await cookieStore).get('auth-token');

        if (!authToken || authToken.value !== 'authenticated') {
            return NextResponse.json(
                { message: 'Non authentifié' },
                { status: 401 }
            );
        }

        // If we have a valid token, return user info
        // In a real app, you'd decode the JWT token to get user info
        return NextResponse.json({
            success: true,
            user: {
                email: process.env.ADMIN_EMAIL // In real app, get from token
            }
        });

    } catch (error) {
        console.error('Auth verification error:', error);
        return NextResponse.json(
            { message: 'Erreur du serveur' },
            { status: 500 }
        );
    }
}