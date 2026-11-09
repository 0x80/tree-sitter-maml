; A string is a value or a key, never both, so these patterns never overlap and
; editors that prefer the first match (tree-sitter CLI, GitHub) agree with
; those that prefer the last (Zed, Neovim).
(pair
  key: (_) @property)

(pair
  value: (string) @string)

(array
  (string) @string)

(document
  (string) @string)

(raw_string) @string

(escape_sequence) @string.escape

(number) @number

[
  (true)
  (false)
] @boolean

(null) @constant.builtin

(comment) @comment

[
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  ":"
  ","
] @punctuation.delimiter
