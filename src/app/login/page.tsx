'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.message || 'Échec de la connexion');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-background flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Formulaire de Connexion */}
                <div className="bg-main-blue rounded-xl shadow-lg p-8 border-2 border-secondary-blue">
                    <div className="flex justify-center pb-10">
                     <Logo size={300} />
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champ Email */}
                        <div>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 bg-white py-3 border-2 border-secondary-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-main-orange focus:border-transparent transition-colors"
                                placeholder="Entrez votre email"
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 bg-white py-3 border-2 border-secondary-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-main-orange focus:border-transparent transition-colors"
                                placeholder="Entrez votre mot de passe"
                            />
                        </div>

                        {/* Message d'erreur */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Bouton de Soumission */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-main-orange cursor-pointer text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-main-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}