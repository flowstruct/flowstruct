import dayjs from 'dayjs';

/**
 * Format an ISO date string or Date object into a readable format
 * @param date Date to format
 * @param format Optional format string (defaults to 'MMM DD, YYYY')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null, format: string = 'MMM DD, YYYY'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * Format an ISO date string or Date object into a readable format including time
 * @param date Date to format
 * @param format Optional format string (defaults to 'MMM DD, YYYY HH:mm')
 * @returns Formatted date string with time
 */
export function formatDateTime(date: Date | string | null, format: string = 'MMM DD, YYYY HH:mm'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}
