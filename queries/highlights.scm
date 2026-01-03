; Highlights for Huff language

; Comments
(line_comment) @comment
(block_comment) @comment

; Literals
(hex_literal) @number
(decimal_literal) @number
(string_literal) @string

; Keywords and directives
"#define" @keyword
"#include" @keyword.import
"macro" @keyword.function
"fn" @keyword.function
"function" @keyword
"event" @keyword
"constant" @keyword
"error" @keyword
"jumptable" @keyword
"jumptable__packed" @keyword
"takes" @keyword
"returns" @keyword
"indexed" @keyword

; Function visibility
(function_visibility) @keyword.modifier

; Types
(type) @type

; Operators and punctuation
"=" @operator
"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"<" @punctuation.bracket
">" @punctuation.bracket
"," @punctuation.delimiter
":" @punctuation.delimiter

; Definition names
(macro_definition
  name: (identifier) @function)
(fn_definition
  name: (identifier) @function)
(function_definition
  name: (identifier) @function)
(event_definition
  name: (identifier) @type)
(constant_definition
  name: (identifier) @constant)
(error_definition
  name: (identifier) @type)
(jumptable_definition
  name: (identifier) @variable)
(jumptable_packed_definition
  name: (identifier) @variable)

; Label definitions
(label_definition
  name: (identifier) @label)

; Macro invocations
(macro_invocation
  name: (identifier) @function.call)

; Constant references
(constant_reference
  name: (identifier) @constant)

; Built-in functions
(builtin_codesize
  "__codesize" @function.builtin)
(builtin_tablesize
  "__tablesize" @function.builtin)
(builtin_tablestart
  "__tablestart" @function.builtin)
(builtin_func_sig
  "__FUNC_SIG" @function.builtin)
(builtin_event_hash
  "__EVENT_HASH" @function.builtin)
(builtin_error
  "__ERROR" @function.builtin)
(builtin_rightpad
  "__RIGHTPAD" @function.builtin)
(free_storage_pointer
  "FREE_STORAGE_POINTER" @function.builtin)

; Parameters
(parameter_list
  (identifier) @variable.parameter)

; EVM Opcodes - categorized for different highlighting
; Arithmetic opcodes
((opcode) @keyword.operator
  (#any-of? @keyword.operator
    "add" "mul" "sub" "div" "sdiv" "mod" "smod"
    "addmod" "mulmod" "exp" "signextend"))

; Comparison opcodes
((opcode) @keyword.operator
  (#any-of? @keyword.operator
    "lt" "gt" "slt" "sgt" "eq" "iszero"))

; Bitwise opcodes
((opcode) @keyword.operator
  (#any-of? @keyword.operator
    "and" "or" "xor" "not" "byte" "shl" "shr" "sar"))

; Cryptographic opcodes
((opcode) @function.builtin
  (#any-of? @function.builtin
    "sha3" "keccak256"))

; Memory and storage opcodes
((opcode) @function.builtin
  (#any-of? @function.builtin
    "mload" "mstore" "mstore8" "sload" "sstore"
    "tload" "tstore" "pop" "msize"))

; Control flow opcodes
((opcode) @keyword.control
  (#any-of? @keyword.control
    "jump" "jumpi" "jumpdest" "stop" "return" "revert" "invalid"))

; Environment opcodes
((opcode) @variable.builtin
  (#any-of? @variable.builtin
    "address" "balance" "origin" "caller" "callvalue"
    "calldataload" "calldatasize" "calldatacopy"
    "codesize" "codecopy" "gasprice"
    "extcodesize" "extcodecopy" "extcodehash"
    "returndatasize" "returndatacopy"))

; Block info opcodes
((opcode) @variable.builtin
  (#any-of? @variable.builtin
    "blockhash" "coinbase" "timestamp" "number"
    "difficulty" "prevrandao" "gaslimit" "chainid"
    "selfbalance" "basefee" "gas" "pc"))

; System opcodes
((opcode) @function.builtin
  (#any-of? @function.builtin
    "create" "call" "callcode" "delegatecall"
    "create2" "staticcall" "selfdestruct"))

; Log opcodes
((opcode) @function.builtin
  (#any-of? @function.builtin
    "log0" "log1" "log2" "log3" "log4"))

; Dup and swap opcodes (fallback for pattern-matched ones)
((opcode) @keyword.operator
  (#match? @keyword.operator "^(dup|swap|push)[0-9]+$"))
