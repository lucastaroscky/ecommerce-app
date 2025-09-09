'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import api from '../services/api';
import { OrderStatus } from '../enums/order.enum';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    name: string
    items: OrderItem[];
    totalAmout: number;
    status: OrderStatus;
    createdAt: string;
}

export const useOrders = (statusFilter?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
            const response = await api.get(url);

            const { data } = response

            setOrders(data.data.orders);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || 'Erro ao buscar pedidos';

            setError(message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    return { orders, loading, error, refetch: fetchOrders };
};
