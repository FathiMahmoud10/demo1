import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** قاعدة موحدة لكل طلبات الـ API */
export const AUTH_API_BASE = 'http://takamulerp.runasp.net';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Maps known API error messages to localized strings (Arabic/English) based on t() */
export function localizeAuthError(
  rawMessage: string,
  t: (key: string) => string,
  fallbackKey: string
): string {
  const n = (rawMessage || '').trim().replace(/^\./, '');
  if (/one or more validation errors/i.test(n)) return t('error_validation');
  if (/invalid|unauthorized|incorrect credentials/i.test(n)) return t(fallbackKey);
  return rawMessage || t(fallbackKey);
}
