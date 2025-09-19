'use client';
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/app/services/api";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    photo: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const useProducts = (page = 1, limit = 10, name = '', sort = '', order = '') => {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [page, limit, name, sort, order]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products?page=${page}&limit=${limit}&name=${name}&sort=${sort}&order=${order}`);
            const data = response.data.data;

            setProducts(data.products);
            setPagination(data.pagination);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Erro ao buscar produtos";
            setError(message);
        } finally {
            setLoading(false);
        }
    };


    return { products, pagination, loading, fetchProducts, error };
};
