/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * @file Tree-sitter grammar for Huff - a low-level EVM assembly language
 * @author Niraj
 * @license MIT
 *
 * Phase 5: Full Huff grammar with built-ins and macro invocations
 */

module.exports = grammar({
  name: 'huff',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    // Entry point - a source file contains zero or more definitions
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.macro_definition,
      $.fn_definition,
      $.function_definition,
      $.event_definition,
      $.constant_definition,
      $.error_definition,
      $.jumptable_definition,
      $.jumptable_packed_definition,
      $.include_directive,
      $.comment,  // Comments can appear at top level
    ),

    // ========================================
    // Comments
    // ========================================
    comment: $ => choice(
      $.line_comment,
      $.block_comment,
    ),

    line_comment: $ => token(seq(
      '//',
      /[^\r\n]*/,
    )),

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

    hex_literal: $ => /0[xX][0-9a-fA-F]+/,

    decimal_literal: $ => /[0-9]+/,

    string_literal: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'"),
    ),

    // ========================================
    // Include directive
    // ========================================
    include_directive: $ => seq(
      '#include',
      field('path', $.string_literal),
    ),

    // ========================================
    // Macro definition
    // #define macro NAME(params) = takes(n) returns(n) { body }
    // ========================================
    macro_definition: $ => seq(
      '#define',
      'macro',
      field('name', $.identifier),
      '(',
      optional(field('parameters', $.parameter_list)),
      ')',
      '=',
      field('takes', $.takes_clause),
      field('returns', $.returns_clause),
      field('body', $.block),
    ),

    // ========================================
    // Fn definition (alternative to macro)
    // #define fn NAME(params) = takes(n) returns(n) { body }
    // ========================================
    fn_definition: $ => seq(
      '#define',
      'fn',
      field('name', $.identifier),
      '(',
      optional(field('parameters', $.parameter_list)),
      ')',
      '=',
      field('takes', $.takes_clause),
      field('returns', $.returns_clause),
      field('body', $.block),
    ),

    takes_clause: $ => seq(
      'takes',
      '(',
      $.decimal_literal,
      ')',
    ),

    returns_clause: $ => seq(
      'returns',
      '(',
      $.decimal_literal,
      ')',
    ),

    parameter_list: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier)),
    ),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}',
    ),

    // Statements inside macro body
    _statement: $ => choice(
      $.label_definition,
      $.macro_invocation,
      $.builtin_call,
      $.constant_reference,
      $.opcode,
      $._literal,
      $.identifier,
    ),

    // Label definition: name:
    label_definition: $ => seq(
      field('name', $.identifier),
      ':',
    ),

    // ========================================
    // Macro invocation
    // MACRO_NAME() or MACRO_NAME<template>(args)
    // ========================================
    macro_invocation: $ => seq(
      field('name', $.identifier),
      optional($.template_args),
      '(',
      optional(field('arguments', $.invocation_args)),
      ')',
    ),

    template_args: $ => seq(
      '<',
      $.identifier,
      repeat(seq(',', $.identifier)),
      '>',
    ),

    invocation_args: $ => seq(
      $._invocation_arg,
      repeat(seq(',', $._invocation_arg)),
    ),

    _invocation_arg: $ => choice(
      $._literal,
      $.identifier,
      $.constant_reference,
    ),

    // ========================================
    // Constant reference [CONSTANT_NAME]
    // ========================================
    constant_reference: $ => seq(
      '[',
      field('name', $.identifier),
      ']',
    ),

    // ========================================
    // Built-in functions
    // ========================================
    builtin_call: $ => choice(
      $.builtin_codesize,
      $.builtin_tablesize,
      $.builtin_tablestart,
      $.builtin_func_sig,
      $.builtin_event_hash,
      $.builtin_error,
      $.builtin_rightpad,
    ),

    builtin_codesize: $ => seq(
      '__codesize',
      '(',
      field('macro', $.identifier),
      ')',
    ),

    builtin_tablesize: $ => seq(
      '__tablesize',
      '(',
      field('table', $.identifier),
      ')',
    ),

    builtin_tablestart: $ => seq(
      '__tablestart',
      '(',
      field('table', $.identifier),
      ')',
    ),

    builtin_func_sig: $ => seq(
      '__FUNC_SIG',
      '(',
      field('function', choice($.identifier, $.string_literal)),
      ')',
    ),

    builtin_event_hash: $ => seq(
      '__EVENT_HASH',
      '(',
      field('event', $.identifier),
      ')',
    ),

    builtin_error: $ => seq(
      '__ERROR',
      '(',
      field('error', $.identifier),
      ')',
    ),

    builtin_rightpad: $ => seq(
      '__RIGHTPAD',
      '(',
      field('value', choice($._literal, $.identifier)),
      ')',
    ),

    // ========================================
    // EVM Opcodes (all lowercase in Huff)
    // ========================================
    opcode: $ => choice(
      // Stop and Arithmetic
      'stop',
      'add',
      'mul',
      'sub',
      'div',
      'sdiv',
      'mod',
      'smod',
      'addmod',
      'mulmod',
      'exp',
      'signextend',

      // Comparison
      'lt',
      'gt',
      'slt',
      'sgt',
      'eq',
      'iszero',

      // Bitwise
      'and',
      'or',
      'xor',
      'not',
      'byte',
      'shl',
      'shr',
      'sar',

      // Cryptographic
      'sha3',
      'keccak256',

      // Environment
      'address',
      'balance',
      'origin',
      'caller',
      'callvalue',
      'calldataload',
      'calldatasize',
      'calldatacopy',
      'codesize',
      'codecopy',
      'gasprice',
      'extcodesize',
      'extcodecopy',
      'returndatasize',
      'returndatacopy',
      'extcodehash',

      // Block information
      'blockhash',
      'coinbase',
      'timestamp',
      'number',
      'difficulty',
      'prevrandao',
      'gaslimit',
      'chainid',
      'selfbalance',
      'basefee',

      // Stack, Memory, Storage
      'pop',
      'mload',
      'mstore',
      'mstore8',
      'sload',
      'sstore',
      'tload',
      'tstore',

      // Control flow
      'jump',
      'jumpi',
      'pc',
      'msize',
      'gas',
      'jumpdest',

      // Push operations (handled as regex patterns)
      /push[1-9]/,
      /push1[0-9]/,
      /push2[0-9]/,
      /push3[0-2]/,

      // Dup operations
      /dup[1-9]/,
      /dup1[0-6]/,

      // Swap operations
      /swap[1-9]/,
      /swap1[0-6]/,

      // Log operations
      'log0',
      'log1',
      'log2',
      'log3',
      'log4',

      // System operations
      'create',
      'call',
      'callcode',
      'return',
      'delegatecall',
      'create2',
      'staticcall',
      'revert',
      'invalid',
      'selfdestruct',
    ),

    // ========================================
    // Function interface definition
    // #define function NAME(types) visibility returns(types)
    // ========================================
    function_definition: $ => seq(
      '#define',
      'function',
      field('name', $.identifier),
      '(',
      optional(field('parameters', $.type_list)),
      ')',
      optional(field('visibility', $.function_visibility)),
      optional(seq(
        'returns',
        '(',
        optional(field('return_type', $.type_list)),
        ')',
      )),
    ),

    function_visibility: $ => choice(
      'nonpayable',
      'payable',
      'view',
      'pure',
    ),

    // ========================================
    // Event definition
    // #define event NAME(type indexed name, ...)
    // ========================================
    event_definition: $ => seq(
      '#define',
      'event',
      field('name', $.identifier),
      '(',
      optional(field('parameters', $.event_parameter_list)),
      ')',
    ),

    event_parameter_list: $ => seq(
      $.event_parameter,
      repeat(seq(',', $.event_parameter)),
    ),

    event_parameter: $ => seq(
      $.type,
      optional('indexed'),
      optional($.identifier),
    ),

    // ========================================
    // Constant definition
    // #define constant NAME = value
    // ========================================
    constant_definition: $ => seq(
      '#define',
      'constant',
      field('name', $.identifier),
      '=',
      field('value', choice(
        $.hex_literal,
        $.decimal_literal,
        $.free_storage_pointer,
      )),
    ),

    free_storage_pointer: $ => seq(
      'FREE_STORAGE_POINTER',
      '(',
      ')',
    ),

    // ========================================
    // Error definition
    // #define error NAME(types)
    // ========================================
    error_definition: $ => seq(
      '#define',
      'error',
      field('name', $.identifier),
      '(',
      optional(field('parameters', $.type_list)),
      ')',
    ),

    // ========================================
    // Jump table definitions
    // #define jumptable NAME { labels }
    // ========================================
    jumptable_definition: $ => seq(
      '#define',
      'jumptable',
      field('name', $.identifier),
      field('body', $.jumptable_body),
    ),

    jumptable_packed_definition: $ => seq(
      '#define',
      'jumptable__packed',
      field('name', $.identifier),
      field('body', $.jumptable_body),
    ),

    jumptable_body: $ => seq(
      '{',
      repeat($.identifier),
      '}',
    ),

    // ========================================
    // Types (for interfaces)
    // ========================================
    type_list: $ => seq(
      $.type,
      repeat(seq(',', $.type)),
    ),

    type: $ => choice(
      'address',
      'bool',
      'string',
      'bytes',
      /bytes[1-9]/,
      /bytes[12][0-9]/,
      /bytes3[0-2]/,
      /uint\d*/,
      /int\d*/,
    ),

    // ========================================
    // Identifiers
    // ========================================
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
