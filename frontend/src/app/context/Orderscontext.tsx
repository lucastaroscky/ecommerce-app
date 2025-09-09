'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    photo: string;
}

export interface Order {
    id: number;
    items: OrderItem[];
    total: number;
    createdAt: string;
}

interface OrdersContextType {
    orders: Order[];
    addOrder: (items: OrderItem[], total: number) => void;
    clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType>({} as OrdersContextType);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = (items: OrderItem[], total: number) => {
        const newOrder: Order = {
            id: orders.length + 1,
            items,
            total,
            createdAt: new Date().toISOString(),
        };

        setOrders(prev => [...prev, newOrder]);
    };

    const clearOrders = () => setOrders([]);

    return (
        <OrdersContext.Provider value={{ orders, addOrder, clearOrders }}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrdersContext = (): OrdersContextType => useContext(OrdersContext);
