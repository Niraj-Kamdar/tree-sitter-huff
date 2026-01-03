/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * @file Tree-sitter grammar for Huff - a low-level EVM assembly language
 * @author Niraj
 * @license MIT
 *
 * Phase 2: Comments, basic structure, and literals
 */

module.exports = grammar({
  name: 'huff',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    // Entry point - a source file contains zero or more definitions
    source_file: $ => repeat($._definition),

    // Placeholder for definitions (will be expanded in later phases)
    _definition: $ => choice(
      $.comment,
      $._literal,
    ),

    // ========================================
    // Comments
    // ========================================
    comment: $ => choice(
      $.line_comment,
      $.block_comment,
    ),

    // Single line comment: // ...
    line_comment: $ => token(seq(
      '//',
      /[^\r\n]*/,
    )),

    // Block comment: /* ... */
    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/',
    )),

    // ========================================
    // Literals
    // ========================================
    _literal: $ => choice(
      $.hex_literal,
      $.decimal_literal,
      $.string_literal,
    ),

    // Hexadecimal literal: 0x1234abcdef
    hex_literal: $ => /0[xX][0-9a-fA-F]+/,

    // Decimal literal: 12345
    decimal_literal: $ => /[0-9]+/,

    // String literal: "hello" or 'hello'
    string_literal: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'"),
    ),
  },
});
