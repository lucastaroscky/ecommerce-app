import { useState } from "react";
import { Product } from "../hooks/useProducts";
import api from "../services/api";

interface ProductFormProps {
    product?: Product | null;
    onClose: () => void;
    onSave: () => void;
}

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [description, setDescription] = useState(product?.description || '');
    const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 0);
    const [photo, setPhoto] = useState(product?.photo || '');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = { name, price, description, stockQuantity, photo };

        if (product) {
            await api.patch(`/products/${product.id}`, payload);
        } else {
            await api.post('/products', payload);
        }

        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
            <form className="bg-white text-black p-6 rounded shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">{product ? 'Editar Produto' : 'Criar Produto'}</h2>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" className="border p-2 mb-2 w-full" />
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Preço" className="border p-2 mb-2 w-full" />
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" className="border p-2 mb-2 w-full" />
                <input type="number" value={stockQuantity} onChange={e => setStockQuantity(Number(e.target.value))} placeholder="Estoque" className="border p-2 mb-2 w-full" />
                <input value={name} onChange={e => setPhoto(e.target.value)} placeholder="Foto Url" className="border p-2 mb-2 w-full" />
                <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
                    <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                </div>
            </form>
        </div>
    );
}
