import React from 'react';

interface GlazingPrices {
    glazing20?: number;
    glazing30?: number;
    glazing50?: number;
}

interface GlazingSelectorProps {
    selectedGlazing: number;
    onSelect: (glazing: number) => void;
    prices?: GlazingPrices;
}

const GlazingSelector: React.FC<GlazingSelectorProps> = ({ selectedGlazing, onSelect, prices }) => {
    const options = [
        { percentage: 20, price: prices?.glazing20 },
        { percentage: 30, price: prices?.glazing30 },
        { percentage: 50, price: prices?.glazing50 },
    ].filter(opt => opt.price !== undefined && opt.price !== null);

    if (options.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Select Glazing
            </h3>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.percentage}
                        onClick={() => onSelect(option.percentage)}
                        className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${selectedGlazing === option.percentage
                                ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-200'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-400 hover:text-cyan-600'
                            }`}
                    >
                        {option.percentage}% Glaze
                        <span className={`block text-xs mt-0.5 ${selectedGlazing === option.percentage ? 'text-cyan-100' : 'text-gray-400'
                            }`}>
                            ₹{option.price}
                        </span>
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
                *Glazing percentage refers to the protective ice coating details.
            </p>
        </div>
    );
};

export default GlazingSelector;
