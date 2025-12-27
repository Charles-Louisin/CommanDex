/**
 * Format price with commas
 * @param price - The price number
 * @returns Formatted price string with commas (e.g., 3500 -> "3,500")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US');
}

/**
 * Format price with currency
 * @param price - The price number
 * @param currency - Currency code (default: 'FCFA')
 * @returns Formatted price string with currency (e.g., 3500 -> "3,500 FCFA")
 */
export function formatPriceWithCurrency(price: number, currency: string = 'FCFA'): string {
  return `${formatPrice(price)} ${currency}`;
}

