# hostname-pattern

[![npm version](https://badge.vercel.app/npm/hostname-pattern)](https://www.npmjs.com/package/hostname-pattern)
[![NPM License](https://badges.sonatype.org/badge/npm/hostname-pattern/license)](https://github.com/npm/package-showcase/blob/main/README.md)

## ✨ Description

`hostname-pattern` is an npm package designed to resolve complex hostname patterns associated with IPv4 address hostnames. It takes these compacted or patterned representations and reliably resolves them to display the true, fully qualified hostname.

This package is essential for systems that save hostnames in a compressed or pattern-based format, ensuring that proper network resolution is achieved when displayed to the end-user or used in further processes.

## 🚀 Installation

Install the package via npm or yarn:

```bash
npm install hostname-pattern
# or
yarn add hostname-pattern
```

## 💡 Usage

You can use the `hostname-pattern` class or function to process and resolve patterns.

### Basic Resolution Example

Assume you have a compacted pattern string and need to resolve it:

```javascript
import { HostnameResolver } from 'hostname-pattern';

// Initialize the resolver (or use the exposed function)
const resolver = new HostnameResolver();

// The pattern you need to resolve
const pattern = "192.168.X.Y:pattern"; 

try {
  // Resolve the pattern
  const resolvedHostname = resolver.resolve(pattern);
  console.log("Resolved Hostname:", resolvedHostname);
} catch (error) {
  console.error("Error resolving hostname:", error);
}
```

### API Reference

#### `HostnameResolver`

The primary class for all resolution operations.

| Method | Description | Parameters | Returns |
| :--- | :--- | :--- | :--- |
| `new HostnameResolver()` | Initializes the resolver instance. | None | `HostnameResolver` instance |
| `resolve(pattern: string): string` | Resolves the given hostname pattern string to its true hostname. | `pattern` (string): The compacted or patterned hostname. | `string`: The fully resolved hostname. |
| `compile(pattern: string): Promise<Pattern>` | Compiles a given pattern into a usable internal pattern structure. | `pattern` (string): The pattern to compile. | `Promise<Pattern>` |

## 📦 Contributing

We welcome contributions! If you have suggestions for new patterns or performance improvements, please open a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
