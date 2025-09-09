'use client';

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Header } from '@/app/components/Header';
import { OrderStatus } from '../enums/order.enum';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../enums/roles.enum';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
}

export interface Order {
    id: string;
    name: string;
    status: OrderStatus;
    totalAmount: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Pendente', value: OrderStatus.PLACED },
    { label: 'Pago', value: OrderStatus.PAID },
    { label: 'Enviado', value: OrderStatus.SHIPPED },
    { label: 'Cancelado', value: OrderStatus.CANCELLED },
];

export default function OrdersPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    console.log(user)

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<OrderStatus | ''>('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = filter ? { status: filter } : {};
            const response = await api.get('/orders', { params });
            const ordersFromApi = response.data.data.orders ?? [];
            setOrders(ordersFromApi);
        } catch (err) {
            console.error(err);
            setError('Erro ao buscar pedidos');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev =>
                prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
            );
        } catch (err) {
            console.error('Erro ao atualizar status', err);
        }
    };

    return (
        <div>
            <Header />

            <main className="pt-16 max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Pedidos</h1>

                {/* Filtro por status */}
                <div className="flex gap-2 mb-6">
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value as OrderStatus | '')}
                            className={`px-4 py-2 rounded ${filter === option.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {loading && <p>Carregando pedidos...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && orders.length === 0 && (
                    <p>Nenhum pedido encontrado.</p>
                )}

                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="border rounded p-4 bg-white shadow">
                            <div className="flex justify-between items-center text-blue-600 mb-2">
                                <span className="font-medium">ID: {order.id}</span>

                                {isAdmin ? (
                                    <select
                                        value={order.status}
                                        onChange={e =>
                                            handleStatusChange(order.id, e.target.value as OrderStatus)
                                        }
                                        className="border rounded px-2 py-1 text-sm"
                                    >
                                        <option value={OrderStatus.PLACED}>Pendente</option>
                                        <option value={OrderStatus.PAID}>Pago</option>
                                        <option value={OrderStatus.SHIPPED}>Enviado</option>
                                        <option value={OrderStatus.CANCELLED}>Cancelado</option>
                                    </select>
                                ) : (
                                    <span
                                        className={`px-2 py-0.5 rounded text-sm font-medium ${order.status === OrderStatus.PLACED
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : order.status === OrderStatus.PAID
                                                ? 'bg-blue-100 text-blue-700'
                                                : order.status === OrderStatus.SHIPPED
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                )}
                            </div>

                            {/* Itens do pedido */}
                            <div className="space-y-1">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between text-gray-700">
                                        <span>
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span>
                                            Valor Unidade: R$ {parseFloat(item.unitPrice).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="mt-2 font-semibold text-black">
                                Total: R$ {parseFloat(order.totalAmount).toFixed(2)}
                            </div>

                            {/* Notas */}
                            {order.notes && (
                                <div className="text-gray-500 text-sm mt-1">{order.notes}</div>
                            )}

                            <div className="text-gray-500 text-sm mt-1">
                                Criado em: {new Date(order.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
