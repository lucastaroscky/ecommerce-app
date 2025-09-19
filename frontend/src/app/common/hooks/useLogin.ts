'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import api from '@/app/services/api';

interface LoginResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        user: User;
    }
}
export function useLogin() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post<LoginResponse>('/auth/login', { email, password }, { withCredentials: true });
            const { accessToken, refreshToken, user } = res.data.data;

            setUser(user);

            Cookies.set('accessToken', accessToken, { expires: 1 });
            Cookies.set('refreshToken', refreshToken, { expires: 7 });

            router.push('/')
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Erro ao fazer login";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}
