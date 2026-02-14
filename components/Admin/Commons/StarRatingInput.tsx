import React, { useState } from 'react';

interface StarRatingInputProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
}

export default function StarRatingInput({ value, onChange, label }: StarRatingInputProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue !== null ? hoverValue : value;

    return (
        <div>
            {label && <label className="mb-2.5 block font-medium text-dark dark:text-white">{label}</label>}
            <div className="flex items-center gap-1" onMouseLeave={() => setHoverValue(null)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoverValue(star)}
                        onClick={() => onChange(star)}
                    >
                        <svg
                            className={`w-8 h-8 ${star <= displayValue ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>
                ))}
                <span className="ml-2 text-sm font-medium text-dark-6">
                    {value > 0 ? `${value} Estrellas` : 'Sin calificación'}
                </span>
            </div>
        </div>
    );
}
