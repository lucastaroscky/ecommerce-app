'use client';
import React from 'react';
import Image from 'next/image';
import { Images } from 'lucide-react';
import { CartItem } from '../common/hooks/useCart';

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    photo: string;
    stockQuantity: number;
    onAddToCart: (item: CartItem) => void;
}

export function ProductCard({
    id, name, description, price, photo, stockQuantity, onAddToCart
}: ProductCardProps) {
    return (
        <div className="border rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition transform bg-white flex flex-col">
            {/* Imagem */}
            <div className="flex items-center justify-center bg-gray-50 h-48 rounded-t">
                {photo ? (
                    <Image
                        src={photo}
                        alt={name}
                        width={500}
                        height={500}
                        className="h-40 object-contain"
                    />
                ) : (
                    <Images className="text-gray-400 w-16 h-16" />
                )}
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-black font-semibold text-base mb-1 line-clamp-2">{name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">{description}</p>

                {/* Preço + Estoque */}
                <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">
                        R$ {price.toFixed(2)}
                    </span>
                    <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${stockQuantity > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                            }`}
                    >
                        {stockQuantity > 0 ? 'Em estoque' : 'Esgotado'}
                    </span>
                </div>

                {/* Botão */}
                <button
                    disabled={stockQuantity === 0}
                    onClick={() =>
                        onAddToCart({ id, name, price, quantity: 1, photo })
                    }
                    className={`mt-4 w-full py-2 rounded font-medium transition ${stockQuantity > 0
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                >
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    );
}
