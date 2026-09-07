import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  resolveHostname,
  ipv4ToUint32,
} from '../src/index.js';

describe('resolveHostname', () => {
  describe('decimal i/j/k/l placeholders', () => {
    it('resolves IPv4 octets', () => {
      expect(
        resolveHostname(
          '-0<i>-<j>-0<k>-0<l>.datamena.net',
          '94.207.36.10',
        ),
      ).toBe(
        '-094-207-036-010.datamena.net',
      );
    });

    it('does not add padding itself', () => {
      expect(
        resolveHostname(
          '<i>-<j>-<k>-<l>.example.com',
          '1.2.3.4',
        ),
      ).toBe(
        '1-2-3-4.example.com',
      );
    });

    it('resolves the supplied iprimus pattern', () => {
      expect(
        resolveHostname(
          '00<l>.010.dsl.qld.iprimus.net.au',
          '211.26.8.0',
        ),
      ).toBe(
        '000.010.dsl.qld.iprimus.net.au',
      );
    });

    it('resolves another supplied iprimus pattern', () => {
      expect(
        resolveHostname(
          '00<l>.022.dsl.brs.iprimus.net.au',
          '211.27.146.0',
        ),
      ).toBe(
        '000.022.dsl.brs.iprimus.net.au',
      );
    });
  });

  describe('m/n/o/p placeholders', () => {
    it('uses three-digit decimal octets without 0x', () => {
      expect(
        resolveHostname(
          '<m><n><o><p>.example.com',
          '88.87.231.151',
        ),
      ).toBe(
        '088087231151.example.com',
      );
    });

    it('pads single-digit octets to three digits', () => {
      expect(
        resolveHostname(
          '<m>-<n>-<o>-<p>.example.com',
          '1.2.3.4',
        ),
      ).toBe(
        '001-002-003-004.example.com',
      );
    });

    it('pads two-digit octets to three digits', () => {
      expect(
        resolveHostname(
          '<m>-<n>-<o>-<p>.example.com',
          '12.34.56.78',
        ),
      ).toBe(
        '012-034-056-078.example.com',
      );
    });

    it('resolves the supplied decimal m/n/o/p pattern', () => {
      expect(
        resolveHostname(
          '1230<n>1580<p>.static.ctinets.com',
          '123.1.158.9',
        ),
      ).toBe(
        '12300011580009.static.ctinets.com',
      );
    });

    it('resolves the supplied predialnet pattern', () => {
      expect(
        resolveHostname(
          '1890<n>1360<p>.usr.predialnet.com.br',
          '189.1.136.9',
        ),
      ).toBe(
        '18900011360009.usr.predialnet.com.br',
      );
    });
  });

  describe('hexadecimal 0x<m><n><o><p> placeholders', () => {
    it('uses hexadecimal only with the 0x prefix', () => {
      expect(
        resolveHostname(
          '0x<m><n><o><p>-static.rev.komnet.hu',
          '88.87.231.151',
        ),
      ).toBe(
        '0x5857e797-static.rev.komnet.hu',
      );
    });

    it('uses lowercase hexadecimal', () => {
      expect(
        resolveHostname(
          '0x<m><n><o><p>.example.com',
          '192.168.10.15',
        ),
      ).toBe(
        '0xc0a80a0f.example.com',
      );
    });

    it('pads hexadecimal octets to two digits', () => {
      expect(
        resolveHostname(
          '0x<m><n><o><p>.example.com',
          '1.2.3.4',
        ),
      ).toBe(
        '0x01020304.example.com',
      );
    });

    it('preserves an uppercase 0X prefix', () => {
      expect(
        resolveHostname(
          '0X<m><n><o><p>.example.com',
          '1.2.3.4',
        ),
      ).toBe(
        '0X01020304.example.com',
      );
    });

    it('resolves the supplied Telia pattern', () => {
      expect(
        resolveHostname(
          '0x<m><n><o><p>.aal.customer.dk.telia.net',
          '62.198.180.1',
        ),
      ).toBe(
        '0x3ec6b401.aal.customer.dk.telia.net',
      );
    });
  });

  describe('OFFSET placeholders', () => {
    it('applies a negative offset', () => {
      const ip =
        '151.103.218.150';

      const expected =
        ipv4ToUint32(ip) -
        2540134867;

      expect(
        resolveHostname(
          'bt<OFFSET:-2540134867>.hvcc.edu',
          ip,
        ),
      ).toBe(
        `bt${expected}.hvcc.edu`,
      );
    });

    it('applies an offset to the IPv4 uint32 value', () => {
      const ip =
        '151.103.218.162';

      const expected =
        ipv4ToUint32(ip) -
        2540165488;

      expect(
        resolveHostname(
          'bt<OFFSET:-2540165488>in.hvcc.edu',
          ip,
        ),
      ).toBe(
        `bt${expected}in.hvcc.edu`,
      );
    });

    it('supports positive offsets', () => {
      const ip =
        '1.2.3.4';

      const expected =
        ipv4ToUint32(ip) + 100;

      expect(
        resolveHostname(
          'host<OFFSET:100>.example.com',
          ip,
        ),
      ).toBe(
        `host${expected}.example.com`,
      );
    });
  });

  describe('input validation', () => {
    it('rejects an invalid IPv4 address', () => {
      expect(() =>
        resolveHostname(
          '<i>.<j>.<k>.<l>',
          '999.1.2.3',
        ),
      ).toThrow(
        'Invalid IPv4 address',
      );
    });

    it('rejects an IPv4 address with too few octets', () => {
      expect(() =>
        resolveHostname(
          '<i>.<j>.<k>.<l>',
          '192.168.1',
        ),
      ).toThrow(
        'Invalid IPv4 address',
      );
    });

    it('rejects non-numeric IPv4 octets', () => {
      expect(() =>
        resolveHostname(
          '<i>.<j>.<k>.<l>',
          '192.168.foo.1',
        ),
      ).toThrow(
        'Invalid IPv4 address',
      );
    });

    it('rejects an out-of-range IPv4 octet', () => {
      expect(() =>
        resolveHostname(
          '<i>.<j>.<k>.<l>',
          '192.168.1.256',
        ),
      ).toThrow(
        'Invalid IPv4 address',
      );
    });

    it('rejects an invalid OFFSET', () => {
      expect(() =>
        resolveHostname(
          'host<OFFSET:999999999999999999999>.example.com',
          '1.2.3.4',
        ),
      ).toThrow(
        'Invalid OFFSET value',
      );
    });
  });

  describe('empty values', () => {
    it('returns an empty pattern unchanged', () => {
      expect(
        resolveHostname(
          '',
          '1.2.3.4',
        ),
      ).toBe('');
    });

    it('returns the pattern when the IP is empty', () => {
      expect(
        resolveHostname(
          '<i>.<j>.<k>.<l>.example.com',
          '',
        ),
      ).toBe(
        '<i>.<j>.<k>.<l>.example.com',
      );
    });
  });
});

describe('ipv4ToUint32', () => {
  it('converts an IPv4 address to uint32', () => {
    expect(
      ipv4ToUint32('1.2.3.4'),
    ).toBe(16909060);
  });

  it('handles 0.0.0.0', () => {
    expect(
      ipv4ToUint32('0.0.0.0'),
    ).toBe(0);
  });

  it('handles 255.255.255.255', () => {
    expect(
      ipv4ToUint32('255.255.255.255'),
    ).toBe(4294967295);
  });
});