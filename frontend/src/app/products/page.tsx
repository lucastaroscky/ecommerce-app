'use client';
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Header } from '@/app/components/Header';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../common/context/AuthContext';
import { useCartContext } from '../common/context/CartContext';
import { SortOptions, FilterLabels } from '../common/enums/labels.enum';
import { UserRole } from '../common/enums/roles.enum';
import useDebounce from '../common/hooks/useDebounce';
import { Product, useProducts } from '../common/hooks/useProducts';

export default function ProductsPage() {
    const { addToCart } = useCartContext();
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'price' | 'name' | 'created_at'>('created_at');
    const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
    const [filterLabel, setFilterLabel] = useState<SortOptions>(SortOptions.created_asc)

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const debouncedSearch = useDebounce(search, 1000);

    const { products, pagination, loading } = useProducts(page, 10, debouncedSearch, sort, order);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setSearch(e.target.value);
        setSort(sort)
        setOrder(order)
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const [field, direction] = value.split('_');

        setSort(field as typeof sort);
        setOrder(direction.toUpperCase() as typeof order);
        setFilterLabel(value as SortOptions)
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCloseForm = () => setShowForm(false);

    if (loading) return <p className="text-center mt-16 text-gray-500">Carregando produtos...</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Barra de busca e ordenação */}
            <div className="pt-16 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={handleSearchChange}
                    className="border-2 border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-2 w-full sm:flex-1 shadow-sm transition text-black placeholder-gray-400"
                />

                <select
                    value={filterLabel}
                    onChange={handleSortChange}
                    className="border-2 border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-2 shadow-sm transition bg-white text-black font-medium"
                >
                    {Object.entries(FilterLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Botão criar produto */}
            {isAdmin && (
                <div className="max-w-7xl mx-auto px-4 mb-4 flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow transition"
                        onClick={handleCreateProduct}
                    >
                        Criar Produto
                    </button>
                </div>
            )}

            {/* Lista de produtos */}
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto">
                {products.map(product => (
                    <div key={product.id} className="relative group">
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price={Number(product.price)}
                            photo={product.photo}
                            stockQuantity={product.stockQuantity}
                            onAddToCart={addToCart}
                        />

                        {isAdmin && (
                            <button
                                onClick={() => handleEditProduct(product)}
                                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                ))}
            </main>

            {/* Paginação */}
            <Pagination
                page={page}
                totalPages={pagination?.totalPages || 1}
                onPrev={() => setPage(prev => prev - 1)}
                onNext={() => setPage(prev => prev + 1)}
            />

            {/* Modal de criação/edição */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={handleCloseForm}
                    onSave={() => {
                        setPage(1)
                    }}
                />
            )}
        </div>
    );
}
