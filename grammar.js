/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * @file Tree-sitter grammar for Huff - a low-level EVM assembly language
 * @author Niraj
 * @license MIT
 *
 * Phase 1: Comments and basic structure
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
    _definition: $ => $.comment,

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
  },
});
