// commands
export const C_ARITHMETIC = 'arithmetic' as const
export const C_PUSH = 'push' as const
export const C_POP = 'pop' as const
export const C_LABEL = 'label' as const
export const C_GOTO = 'goto' as const
export const C_IF = 'if-goto' as const
export const C_FUNCTION = 'function' as const
export const C_RETURN = 'return' as const
export const C_CALL = 'call' as const

export type CommandTypes =
  | typeof C_ARITHMETIC
  | typeof C_PUSH
  | typeof C_POP
  | typeof C_LABEL
  | typeof C_GOTO
  | typeof C_IF
  | typeof C_FUNCTION
  | typeof C_RETURN
  | typeof C_CALL


// signatures
export const S_LOCAL = 'local' as const
export const S_ARGUMENT = 'argument' as const
export const S_THIS = 'this' as const
export const S_THAT= 'that' as const
export const S_POINTER = 'pointer' as const
export const S_TEMP = 'temp' as const
export const S_CONSTANT = 'constant' as const
export const S_STATIC = 'static' as const
export type SignatureTypes = typeof S_LOCAL |typeof S_ARGUMENT |typeof S_THIS |typeof S_THAT |typeof S_POINTER |typeof S_TEMP |typeof S_CONSTANT | typeof S_STATIC