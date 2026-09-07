#!/usr/bin/env node

import { resolveHostname } from './resolver.js';

function usage(): never {
  console.error(`
Usage:
  hostname-pattern <pattern> <ip>

Examples:
  hostname-pattern '-0<i>-<j>-0<k>-0<l>.datamena.net' 94.207.36.10

  hostname-pattern '0x<m><n><o><p>-static.rev.komnet.hu' 88.87.231.151

  hostname-pattern 'bt<OFFSET:-2540134867>.hvcc.edu' 151.103.218.150
`);

  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length !== 2) {
  usage();
}

const [pattern, ip] = args;

try {
  const hostname = resolveHostname(pattern, ip);

  console.log(hostname);
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );

  process.exit(1);
}