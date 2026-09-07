import {
  ipv4ToUint32,
  parseIPv4,
} from './ip.js';

const DECIMAL_PLACEHOLDERS: Record<string, number> = {
  i: 0,
  j: 1,
  k: 2,
  l: 3,
};

const OCTET_PLACEHOLDERS: Record<string, number> = {
  m: 0,
  n: 1,
  o: 2,
  p: 3,
};

export function applyPattern(
  pattern: string,
  ip: string,
): string {
  const octets = parseIPv4(ip);

  let result = pattern;

  /*
   * <OFFSET:number>
   *
   * IPv4 uint32 + offset.
   */
  result = result.replace(
    /<OFFSET:([+-]?\d+)>/g,
    (_, offsetString: string) => {
      const offset = Number(offsetString);

      if (!Number.isSafeInteger(offset)) {
        throw new Error(
          `Invalid OFFSET value: ${offsetString}`,
        );
      }

      return String(
        ipv4ToUint32(ip) + offset,
      );
    },
  );

  /*
   * <i>, <j>, <k>, <l>
   *
   * Plain decimal IPv4 octets.
   *
   * Example:
   *   -0<i>-<j>-0<k>-0<l>
   *   94.207.36.10
   *
   * becomes:
   *   -094-207-036-010
   *
   * The padding is supplied by the pattern itself.
   */
  result = result.replace(
    /<([ijkl])>/g,
    (_, placeholder: string) => {
      const index =
        DECIMAL_PLACEHOLDERS[placeholder];

      return String(octets[index]);
    },
  );

  /*
   * 0x<m><n><o><p>
   *
   * When m/n/o/p are preceded by the 0x prefix,
   * the four IPv4 octets are encoded as hexadecimal.
   *
   * Example:
   *
   *   88.87.231.151
   *   -> 0x5857e797
   */
  result = result.replace(
    /0x<m><n><o><p>/gi,
    (match: string) => {
      const prefix =
        match.slice(0, 2);

      return (
        prefix +
        octets
          .map((octet) =>
            octet
              .toString(16)
              .padStart(2, '0'),
          )
          .join('')
      );
    },
  );

  /*
   * <m>, <n>, <o>, <p>
   *
   * If they are NOT part of a 0x<m><n><o><p>
   * expression, they represent decimal octets,
   * padded to three digits.
   *
   * Example:
   *
   *   <m><n><o><p>
   *   88.87.231.151
   *
   * becomes:
   *
   *   088087231151
   */
  result = result.replace(
    /<([mnop])>/g,
    (_, placeholder: string) => {
      const index =
        OCTET_PLACEHOLDERS[placeholder];

      return String(octets[index])
        .padStart(3, '0');
    },
  );

  return result;
}