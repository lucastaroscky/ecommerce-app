'use client';
import { useState, useMemo } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    photo: string;
}

export function useCart() {
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

    return { cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice };
}
