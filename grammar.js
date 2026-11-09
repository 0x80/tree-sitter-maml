/**
 * @file Tree-sitter grammar for MAML (https://maml.dev/spec/v0.1)
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * The spec requires a comma or a newline between members and items. Newlines
 * are extras here, so the separator comma is optional and `{ a: 1 b: 2 }` on
 * one line parses; a highlighter does not need to reject it.
 */
module.exports = grammar({
  name: 'maml',

  extras: $ => [/\s/, $.comment],

  supertypes: $ => [$._value],

  rules: {
    document: $ => optional($._value),

    _value: $ => choice(
      $.object,
      $.array,
      $.string,
      $.raw_string,
      $.number,
      $.true,
      $.false,
      $.null,
    ),

    object: $ => seq(
      '{',
      repeat(seq($.pair, optional(','))),
      '}',
    ),

    pair: $ => seq(
      field('key', choice($.identifier, $.string)),
      ':',
      field('value', $._value),
    ),

    array: $ => seq(
      '[',
      repeat(seq($._value, optional(','))),
      ']',
    ),

    /** Unquoted keys: ASCII letters, digits, `-` and `_`, so `123` and `true` are keys too. */
    identifier: _ => /[A-Za-z0-9_-]+/,

    string: $ => seq(
      '"',
      repeat(choice($.string_content, $.escape_sequence)),
      token.immediate('"'),
    ),

    /** Precedence 1 keeps `#` and spaces inside a string from lexing as a comment or whitespace. */
    string_content: _ => token.immediate(prec(1, /[^"\\\r\n]+/)),

    escape_sequence: _ => token.immediate(seq(
      '\\',
      choice(/[\\"nrt]/, /u\{[0-9A-Fa-f]{1,6}\}/),
    )),

    /** No escapes; one or two quotes may appear inside, three end the string. */
    raw_string: _ => token(seq(
      '"""',
      repeat(choice(/[^"]/, /"[^"]/, /""[^"]/)),
      '"""',
    )),

    number: _ => token(seq(
      optional('-'),
      choice('0', /[1-9][0-9]*/),
      optional(/\.[0-9]+/),
      optional(/[eE][+-]?[0-9]+/),
    )),

    true: _ => 'true',
    false: _ => 'false',
    null: _ => 'null',

    comment: _ => token(seq('#', /[^\r\n]*/)),
  },
});
