'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { useOrdersContext, OrderItem } from '../context/Orderscontext';
import api from '@/app/services/api';

interface UseCreateOrderReturn {
    createOrder: (items: OrderItem[]) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export function useCreateOrder(): UseCreateOrderReturn {
    const { addOrder } = useOrdersContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = async (items: OrderItem[]) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post('orders', payload);

            addOrder(items, items.reduce((sum, i) => sum + i.quantity * i.price, 0));

            return response.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || 'Erro ao criar pedido';

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { createOrder, loading, error };
}
