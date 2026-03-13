import { useState } from 'react';
import SizeSelector from './SizeSelector';
import { clientAddToCart } from '../lib/shopify-client';
import { openCart } from '../lib/cart';

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
}

export default function AddToCart({ variants }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants.find((v) => v.availableForSale)?.id || ''
  );
  const [loading, setLoading] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const price = selectedVariant
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: selectedVariant.price.currencyCode,
      }).format(parseFloat(selectedVariant.price.amount))
    : '';

  async function handleAdd() {
    if (!selectedVariantId) return;
    setLoading(true);
    try {
      await clientAddToCart(selectedVariantId);
      openCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <SizeSelector
        variants={variants}
        selectedId={selectedVariantId}
        onSelect={setSelectedVariantId}
      />

      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold">{price}</span>
      </div>

      <button
        onClick={handleAdd}
        disabled={!selectedVariantId || loading}
        className="w-full bg-redwings hover:bg-redwings-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
