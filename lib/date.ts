// File: lib/date.ts
// Utility functions for date and time handling

function normalizeDate(date: Date | string): Date | null {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date as a readable string
 */
export function formatDate(date: Date | string): string {
  const d = normalizeDate(date);
  if (!d) return 'Invalid date';

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = normalizeDate(date);
  if (!d) return 'Invalid date';

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time (e.g., "2 days ago") with locale support
 */
export function getRelativeTime(
  date: Date | string,
  locale: string = 'en',
): string {
  const d = normalizeDate(date);
  if (!d) return 'Invalid date';

  const now = new Date();
  const diffMs = d.getTime() - now.getTime(); // Negative if in the past
  const diffSec = Math.round(diffMs / 1000);

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diffSec);

  if (abs < 60) return formatter.format(Math.floor(diffSec), 'second');
  if (abs < 3600) return formatter.format(Math.floor(diffSec / 60), 'minute');
  if (abs < 86400) return formatter.format(Math.floor(diffSec / 3600), 'hour');
  if (abs < 2592000)
    return formatter.format(Math.floor(diffSec / 86400), 'day');
  if (abs < 31536000)
    return formatter.format(Math.floor(diffSec / 2592000), 'month');
  return formatter.format(Math.floor(diffSec / 31536000), 'year');
}

/**
 * Count the number of words in a string
 */
export function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculate reading time for text content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = countWords(content);
  return Math.ceil(words / wordsPerMinute);
}
