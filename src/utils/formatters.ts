/**
 * Date and currency formatting utilities
 * Ensures dynamic month/year rendering across all agency screens
 */

export function getCurrentMonthBadge(): string {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

export function getCurrentMonthFull(): string {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatINR(val: number): string {
  return `₹${val.toLocaleString('en-IN')}`;
}
