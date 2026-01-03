# tree-sitter-huff

Tree-sitter grammar for [Huff](https://docs.huff.sh/), a low-level EVM assembly language for writing highly optimized smart contracts.

## Features

- Full syntax highlighting support
- Incremental parsing
- Compatible with any editor that supports tree-sitter (Zed, Neovim, Helix, etc.)

## Installation

```bash
npm install tree-sitter-huff
```

## Usage

### In Node.js

```javascript
const Parser = require('tree-sitter');
const Huff = require('tree-sitter-huff');

const parser = new Parser();
parser.setLanguage(Huff);

const sourceCode = `
// Simple Huff contract
#define macro MAIN() = takes(0) returns(0) {
    0x00 0x00 revert
}
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
```

## Development

### Prerequisites

- Node.js 18+
- tree-sitter-cli (`npm install -g tree-sitter-cli`)

### Building

```bash
npm install
npm run build
```

### Testing

```bash
npm test
```

### Parsing a file

```bash
tree-sitter parse examples/comments.huff
```

## Grammar Status

| Feature | Status |
|---------|--------|
| Comments | Done |
| Literals | Pending |
| Define directives | Pending |
| Opcodes | Pending |
| Built-in functions | Pending |
| Macro invocations | Pending |

## License

MIT
