import { applyPattern } from './pattern.js';

/**
 * Resolve a hostname pattern using an IPv4 address.
 *
 * @param pattern Hostname pattern
 * @param ip IPv4 address
 */
export function resolveHostname(
  pattern: string,
  ip: string,
): string {
  if (!pattern) {
    return '';
  }

  if (!ip) {
    return pattern;
  }

  return applyPattern(pattern, ip);
}