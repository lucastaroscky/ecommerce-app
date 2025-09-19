'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '../common/context/CartContext';
import { useCreateOrder } from '../common/hooks/useCreateOrder';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, removeFromCart, totalPrice, clearCart } = useCartContext();
    const { createOrder, loading } = useCreateOrder();
    const router = useRouter()

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        await createOrder(cart);
        clearCart();
        router.push('/orders')
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
        >
            {/* Header do carrinho */}
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold text-black">Carrinho</h2>
                <button onClick={onClose}>
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Lista de itens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 && <p>Seu carrinho está vazio.</p>}

                {cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center text-black">
                        <Image
                            src={item.photo}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-cover rounded"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                            <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>

            {/* Total e botão finalizar */}
            {cart.length > 0 && (
                <div className="p-4 border-t text-black flex flex-col gap-2">
                    <p className="text-lg font-bold">Total: R$ {totalPrice.toFixed(2)}</p>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || loading}
                        className="mt-4 w-full py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                    >
                        {loading ? 'Processando...' : 'Finalizar Pedido'}
                    </button>
                </div>
            )}
        </div>
    );
}
