'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCartContext } from '../context/CartContext';
import { ShoppingCartIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CartDrawer } from './CartDrawer';

export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { totalItems } = useCartContext();
    const { logout } = useAuth();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/">
                        <span className="font-bold text-xl text-blue-600">Ecommerce</span>
                    </Link>

                    {/* Menu */}
                    <div className="flex items-center gap-6">
                        {/* Link para pedidos */}
                        <Link
                            href="/orders"
                            className="text-gray-700 font-medium hover:text-blue-600 transition"
                        >
                            Meus Pedidos
                        </Link>

                        {/* Carrinho */}
                        <button
                            className="relative p-2 rounded hover:bg-gray-100 transition"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="hidden sm:inline text-gray-700 font-medium hover:text-blue-600 transition"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
};
