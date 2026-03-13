/**
 * Client-side Shopify cart operations.
 * Runs in the browser — uses fetch to talk to Shopify Storefront API directly.
 */

import { $cart, type Cart, type CartLine } from './cart';

function getConfig() {
  // These are public storefront tokens, safe for client-side use
  const domain = (import.meta as any).env?.PUBLIC_SHOPIFY_STORE_DOMAIN
    || (window as any).__SHOPIFY_DOMAIN__;
  const token = (import.meta as any).env?.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    || (window as any).__SHOPIFY_TOKEN__;
  return { domain, token };
}

async function storefrontFetch(query: string, variables: Record<string, unknown> = {}) {
  const { domain, token } = getConfig();
  const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: any) => e.message).join(', '));
  return json.data;
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              product {
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

function parseCart(shopifyCart: any): Cart {
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    totalAmount: shopifyCart.cost.totalAmount.amount,
    totalCurrencyCode: shopifyCart.cost.totalAmount.currencyCode,
    lines: shopifyCart.lines.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.merchandise.product.title,
      variantTitle: edge.node.merchandise.title,
      quantity: edge.node.quantity,
      price: edge.node.merchandise.price.amount,
      currencyCode: edge.node.merchandise.price.currencyCode,
      image: edge.node.merchandise.image?.url,
      variantId: edge.node.merchandise.id,
    })),
  };
}

function getCartId(): string | null {
  return localStorage.getItem('shopify_cart_id');
}

function setCartId(id: string) {
  localStorage.setItem('shopify_cart_id', id);
}

export async function clientAddToCart(variantId: string, quantity: number = 1) {
  const cartId = getCartId();

  let data: any;
  if (!cartId) {
    data = await storefrontFetch(
      `${CART_FRAGMENT}
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) { cart { ...CartFields } }
      }`,
      { input: { lines: [{ merchandiseId: variantId, quantity }] } }
    );
    const cart = parseCart(data.cartCreate.cart);
    setCartId(cart.id);
    $cart.set(cart);
  } else {
    data = await storefrontFetch(
      `${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }`,
      { cartId, lines: [{ merchandiseId: variantId, quantity }] }
    );
    $cart.set(parseCart(data.cartLinesAdd.cart));
  }
}

export async function clientUpdateCartLine(lineId: string, quantity: number) {
  const cartId = getCartId();
  if (!cartId) return;

  const data = await storefrontFetch(
    `${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  $cart.set(parseCart(data.cartLinesUpdate.cart));
}

export async function clientRemoveCartLine(lineId: string) {
  const cartId = getCartId();
  if (!cartId) return;

  const data = await storefrontFetch(
    `${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
    }`,
    { cartId, lineIds: [lineId] }
  );
  $cart.set(parseCart(data.cartLinesRemove.cart));
}

export async function clientFetchCart() {
  const cartId = getCartId();
  if (!cartId) return;

  try {
    const data = await storefrontFetch(
      `${CART_FRAGMENT}
      query Cart($cartId: ID!) {
        cart(id: $cartId) { ...CartFields }
      }`,
      { cartId }
    );
    if (data.cart) {
      $cart.set(parseCart(data.cart));
    }
  } catch {
    // Cart may have expired, clear it
    localStorage.removeItem('shopify_cart_id');
  }
}
