; Locals for Huff language

; Macro and fn definitions create a new scope
(macro_definition) @local.scope
(fn_definition) @local.scope

; Parameters are local definitions
(parameter_list
  (identifier) @local.definition)

; Label definitions
(label_definition
  name: (identifier) @local.definition)

; Constant definitions at top level
(constant_definition
  name: (identifier) @local.definition)

; References
(identifier) @local.reference
