import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { $cart, $cartOpen, closeCart } from '../lib/cart';
import { clientFetchCart, clientUpdateCartLine, clientRemoveCartLine } from '../lib/shopify-client';

export default function CartDrawer() {
  const cart = useStore($cart);
  const isOpen = useStore($cartOpen);

  useEffect(() => {
    clientFetchCart();
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const total = cart
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cart.totalCurrencyCode,
      }).format(parseFloat(cart.totalAmount))
    : '$0.00';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-black-light border-l border-white/10 z-[70] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(!cart || cart.lines.length === 0) ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              cart.lines.map((line) => {
                const linePrice = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: line.currencyCode,
                }).format(parseFloat(line.price) * line.quantity);

                return (
                  <div key={line.id} className="flex gap-4 py-4 border-b border-white/10">
                    {line.image && (
                      <img
                        src={line.image}
                        alt={line.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{line.title}</h3>
                      <p className="text-gray-400 text-sm">{line.variantTitle}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => {
                            if (line.quantity <= 1) {
                              clientRemoveCartLine(line.id);
                            } else {
                              clientUpdateCartLine(line.id, line.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-white/20 text-white hover:border-white/40 flex items-center justify-center text-sm transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{line.quantity}</span>
                        <button
                          onClick={() => clientUpdateCartLine(line.id, line.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-white/20 text-white hover:border-white/40 flex items-center justify-center text-sm transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{linePrice}</p>
                      <button
                        onClick={() => clientRemoveCartLine(line.id)}
                        className="text-gray-600 hover:text-redwings text-xs mt-1 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart && cart.lines.length > 0 && (
            <div className="p-4 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">{total}</span>
              </div>
              <a
                href={cart.checkoutUrl}
                className="block w-full bg-redwings hover:bg-redwings-dark text-white font-bold py-4 rounded-lg text-center text-lg transition-colors duration-200"
              >
                Checkout
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
