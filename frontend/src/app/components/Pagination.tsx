'use client';
import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-4 my-6">
            <button
                onClick={onPrev}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-medium transition 
                    ${page === 1
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                Anterior
            </button>

            <span className="font-semibold text-gray-700">
                Página {page} de {totalPages}
            </span>

            <button
                onClick={onNext}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition
                    ${page === totalPages
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                Próxima
            </button>
        </div>
    );
};
