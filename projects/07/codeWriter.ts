import {
  CommandTypes,
  C_ARITHMETIC,
  C_PUSH,
  C_POP,
  C_LABEL,
  C_GOTO,
  C_IF,
  C_FUNCTION,
  C_RETURN,
  C_CALL,
  S_CONSTANT,
} from './types'
import { error } from './util'
import { StackManager } from './stack'

export const getCommandType = (command: string): CommandTypes => {
  switch (command) {
    case 'arithmetic':
      return C_ARITHMETIC
    case 'push':
      return C_PUSH
    case 'pop':
      return C_POP
    case 'label':
      return C_LABEL
    case 'goto':
      return C_GOTO
    case 'if':
      return C_IF
    case 'function':
      return C_FUNCTION
    case 'return':
      return C_RETURN
    case 'call':
      return C_CALL
    default:
      return C_ARITHMETIC
  }
}

export const convertStrToInt = (str: string | null) => {
  if (str == null) return null
  const parsedInt = parseInt(str, 10)
  if (!isFinite(parsedInt)) return null
  return parsedInt
}

export const writePushPop = (sig: string | null, arg: string | null) => {
  if (sig == null) return error(`sig: ${sig} is invalid.`)
  if (sig === S_CONSTANT) return `// constant ${arg}\n@${arg}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1`
  return null
}

export const C_ADD = 'add' as const
export const C_SUB = 'sub' as const
export const C_NEG = 'neg' as const
export const C_AND = 'and' as const
export const C_OR = 'or' as const
export const C_NOT = 'not' as const
export const C_EQ = 'eq' as const
export const C_LT = 'lt' as const
export const C_GT = 'gt' as const

export const writeArithmetic = (command: string) => {
  const index = StackManager.getIndex()
  if (command === C_ADD) return `// add\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A+D\n@SP\nA=M\nM=D\n@SP\nM=M+1`
  if (command === C_SUB) return `// sub\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@SP\nA=M\nM=D\n@SP\nM=M+1`
  if (command === C_NEG) return '// neg\n@SP\nA=M-1\nM=-M\n@SP\nAM=M-1\nD=M'
  if (command === C_AND) return '// and\n@SP\nAM=M-1\nA=M\nD=D&A\n@SP\nA=M\nM=D\n@SP\nM=M+1'
  if (command === C_OR) return '// or\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nM=D|M\n@SP\nM=M+1'
  if (command === C_NOT) return '// not\n@SP\nAM=M-1\nM=!M\n@SP\nM=M+1'
  if (command === C_EQ) {
    const str = `// eq\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@TRUE${index}\nD;JEQ\nD=0\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@END${index + 1}\n0;JMP\n(TRUE${index})\nD=-1\n@SP\nA=M\nM=D\n@SP\nM=M+1\n(END${index + 1})`
    StackManager.addIndex()
    return str
  }
  if (command === C_LT) {
    const str = `// lt\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@TRUE${index}\nD;JLT\nD=0\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@END${index + 1}\n0;JMP\n(TRUE${index})\nD=-1\n@SP\nA=M\nM=D\n@SP\nM=M+1\n(END${index + 1})`
    StackManager.addIndex()
    return str
  }
  if (command === C_GT) {
    const str = `// gt\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@TRUE${index}\nD;JGT\nD=0\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@END${index + 1}\n0;JMP\n(TRUE${index})\nD=-1\n@SP\nA=M\nM=D\n@SP\nM=M+1\n(END${index + 1})`
    StackManager.addIndex()
    return str
  }
}

export const CodeWriter = (command: string, ...arg: (string | null)[]) => {
  const commandType = getCommandType(command)
  const code: string[] = []
  if (commandType === C_PUSH) {
    const pushPopCode = writePushPop(arg[0], arg[1])
    pushPopCode != null && code.push(pushPopCode)
  }
  if (commandType === C_ARITHMETIC) {
    const arithmeticCode = writeArithmetic(command)
    arithmeticCode && code.push(arithmeticCode)
  }
  return code.join('\n')
}