'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { UserRole } from '../enums/roles.enum';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = Cookies.get('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (user: User) => {
        setUserState(user);
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
    };

    const logout = () => {
        setUserState(null);
        Cookies.remove('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
