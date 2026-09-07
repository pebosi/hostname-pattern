export type IPv4Octets = [
  number,
  number,
  number,
  number,
];

export function parseIPv4(ip: string): IPv4Octets {
  const parts = ip.split('.');

  if (parts.length !== 4) {
    throw new Error(`Invalid IPv4 address: ${ip}`);
  }

  const octets = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error(`Invalid IPv4 address: ${ip}`);
    }

    const value = Number(part);

    if (!Number.isInteger(value) || value < 0 || value > 255) {
      throw new Error(`Invalid IPv4 address: ${ip}`);
    }

    return value;
  });

  return octets as IPv4Octets;
}

/**
 * Convert an IPv4 address to its unsigned 32-bit representation.
 *
 * Example:
 *
 * 1.2.3.4 -> 16909060
 */
export function ipv4ToUint32(ip: string): number {
  const [a, b, c, d] = parseIPv4(ip);

  return (
    a * 0x1000000 +
    b * 0x10000 +
    c * 0x100 +
    d
  );
}