# tree-sitter-maml

A [tree-sitter](https://tree-sitter.github.io) grammar for [MAML](https://maml.dev/spec/v0.1).

The parser in `src/` is generated at ABI 14 so older tree-sitter runtimes can load it.
Regenerate it after editing `grammar.js`:

```sh
npm install
npm run generate
npm test
```

## Differences from the spec

The grammar accepts a superset of MAML, which is what a highlighter needs:

- The separator between members and items is optional. The spec requires a comma or a
  newline, so `{ a: 1 b: 2 }` on one line is invalid MAML but parses here.
- An empty document parses.
- Duplicate keys, out-of-range integers and `\u{...}` values outside the Unicode scalar
  range are not rejected.

## Queries

`queries/highlights.scm` captures a string as `@string` only where it is a value, so a
key never matches two patterns. The result is the same whether an editor lets the first
matching pattern win or the last.
