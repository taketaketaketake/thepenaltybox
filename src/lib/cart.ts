import { atom, computed } from 'nanostores';

export interface CartLine {
  id: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: string;
  currencyCode: string;
  image?: string;
  variantId: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  totalAmount: string;
  totalCurrencyCode: string;
}

export const $cart = atom<Cart | null>(null);
export const $cartOpen = atom(false);

export const $cartCount = computed($cart, (cart) => {
  if (!cart) return 0;
  return cart.lines.reduce((sum, line) => sum + line.quantity, 0);
});

export function openCart() {
  $cartOpen.set(true);
}

export function closeCart() {
  $cartOpen.set(false);
}

export function toggleCart() {
  $cartOpen.set(!$cartOpen.get());
}
