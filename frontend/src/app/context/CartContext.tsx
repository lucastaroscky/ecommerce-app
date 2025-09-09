'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    photo: string;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextProps>({} as CartContextProps);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setCart([]);

    const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((sum, i) => sum + i.quantity * i.price, 0), [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);
