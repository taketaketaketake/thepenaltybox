import { useState } from 'react';

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface Props {
  variants: Variant[];
  onSelect: (variantId: string) => void;
  selectedId?: string;
}

export default function SizeSelector({ variants, onSelect, selectedId }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-3">Size</label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => variant.availableForSale && onSelect(variant.id)}
            disabled={!variant.availableForSale}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200
              ${
                selectedId === variant.id
                  ? 'border-redwings bg-redwings text-white'
                  : variant.availableForSale
                    ? 'border-white/20 text-white hover:border-white/40'
                    : 'border-white/10 text-gray-600 cursor-not-allowed line-through'
              }
            `}
          >
            {variant.title}
          </button>
        ))}
      </div>
    </div>
  );
}
