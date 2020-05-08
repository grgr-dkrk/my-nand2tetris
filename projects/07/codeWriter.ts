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
  S_LOCAL,
  S_ARGUMENT,
  S_THIS,
  S_THAT,
  S_TEMP,
  S_POINTER,
  S_STATIC,
} from './types'
import { error } from './util'
import { StackManager } from './stack'

export const C_ADD = 'add' as const
export const C_SUB = 'sub' as const
export const C_NEG = 'neg' as const
export const C_AND = 'and' as const
export const C_OR = 'or' as const
export const C_NOT = 'not' as const
export const C_EQ = 'eq' as const
export const C_LT = 'lt' as const
export const C_GT = 'gt' as const

// command の種類
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
    case 'if-goto':
      return C_IF
    case 'function':
      return C_FUNCTION
    case 'return':
      return C_RETURN
    case 'call':
      return C_CALL
    case 'function':
      return C_FUNCTION
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

export const setSignatureLavel = (sig: string) => {
  switch (sig) {
    case S_LOCAL:
      return 'LCL'
    case S_ARGUMENT:
      return 'ARG'
    case S_THIS:
      return 'THIS'
    case S_THAT:
      return 'THAT'
    case S_CONSTANT:
      return 'CONSTANT'
    case S_TEMP:
      return 'TEMP'
    case S_POINTER:
      return 'POINTER'
    case S_STATIC:
      return 'STATIC'
    default:
      error(`signature ${sig} is invalid`)
      return ''
  }
}

// temp の場合は i + 5 にアクセスする
export const getTempIndex = (arg: string | null) =>
  arg ? parseInt(arg) + 5 : 5
// pointer の場合は i + 3 にアクセスする
export const getPointerIndex = (arg: string | null) =>
  arg ? parseInt(arg) + 3 : 3

export const writePushPop = (
  command: string,
  sig: string | null,
  arg: string | null,
  currentFunctionName?: string,
) => {
  if (sig == null) return error(`sig: ${sig} is invalid.`)
  const signatureLabel = setSignatureLavel(sig)
  console.log(command)
  // pop
  if (command === C_POP) {
    if (sig === S_TEMP)
      return `// pop temp ${arg}\n@SP\nM=M-1\nA=M\nD=M\n@${getTempIndex(
        arg,
      )}\nM=D`
    if (sig === S_POINTER)
      return `// pop pointer ${arg}\n@SP\nM=M-1\nA=M\nD=M\n@${getPointerIndex(
        arg,
      )}\nM=D`
    if (sig === S_STATIC) {
      return `// pop ${
        currentFunctionName || 'static'
      } ${arg}\n@SP\nM=M-1\nA=M\nD=M\n@${
        currentFunctionName || 'static'
      }.${arg}\nM=D`
    }
    return `// pop ${sig} ${arg}\n@${arg}\nD=A\n@${signatureLabel}\nA=M\nD=D+A\n@${signatureLabel}\nM=D\n@SP\nM=M-1\nA=M\nD=M\n@${signatureLabel}\nA=M\nM=D\n@${arg}\nD=A\n@${signatureLabel}\nA=M\nD=A-D\n@${signatureLabel}\nM=D`
  }
  // push
  if (command === C_PUSH) {
    if (sig === S_TEMP)
      return `// push temp ${arg}\n@${getTempIndex(
        arg,
      )}\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1`
    if (sig === S_POINTER) {
      return `// push pointer ${arg}\n@${getPointerIndex(
        arg,
      )}\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1`
    }
    if (sig === S_STATIC) {
      return `// push ${currentFunctionName || 'static'} ${arg}\n@${
        currentFunctionName || 'static'
      }.${arg}\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1`
    }
    if (sig === S_CONSTANT)
      return `// push constant ${arg}\n@${arg}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1`
    return `// push ${sig} ${arg}\n@${arg}\nD=A\n@${signatureLabel}\nA=M\nD=D+A\nA=D\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1`
  }
  return null
}

export const writeArithmetic = (command: string) => {
  const index = StackManager.getIndex()
  if (command === C_ADD)
    return `// add\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A+D\n@SP\nA=M\nM=D\n@SP\nM=M+1`
  if (command === C_SUB)
    return `// sub\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@SP\nA=M\nM=D\n@SP\nM=M+1`
  if (command === C_NEG) return '// neg\n@SP\nA=M-1\nM=-M\n@SP\nAM=M-1\nD=M'
  if (command === C_AND)
    return '// and\n@SP\nAM=M-1\nA=M\nD=D&A\n@SP\nA=M\nM=D\n@SP\nM=M+1'
  if (command === C_OR)
    return '// or\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nM=D|M\n@SP\nM=M+1'
  if (command === C_NOT) return '// not\n@SP\nAM=M-1\nM=!M\n@SP\nM=M+1'
  if (command === C_EQ) {
    const str = `// eq\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@TRUE${index}\nD;JEQ\nD=0\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@END${
      index + 1
    }\n0;JMP\n(TRUE${index})\nD=-1\n@SP\nA=M\nM=D\n@SP\nM=M+1\n(END${
      index + 1
    })`
    StackManager.addIndex()
    return str
  }
  if (command === C_LT) {
    const str = `// lt\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@TRUE${index}\nD;JLT\nD=0\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@END${
      index + 1
    }\n0;JMP\n(TRUE${index})\nD=-1\n@SP\nA=M\nM=D\n@SP\nM=M+1\n(END${
      index + 1
    })`
    StackManager.addIndex()
    return str
  }
  if (command === C_GT) {
    const str = `// gt\n@SP\nAM=M-1\nD=M\n@SP\nAM=M-1\nA=M\nD=A-D\n@TRUE${index}\nD;JGT\nD=0\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@END${
      index + 1
    }\n0;JMP\n(TRUE${index})\nD=-1\n@SP\nA=M\nM=D\n@SP\nM=M+1\n(END${
      index + 1
    })`
    StackManager.addIndex()
    return str
  }
}

export const writeLabel = (labelName: string | null) => {
  if (labelName == null) error('label is not found')
  const functionName = StackManager.getCurrentFunctionName()
  return `// add Label ${functionName && `${functionName}$`}${labelName}\n(${
    functionName && `${functionName}$`
  }${labelName})`
}

export const writeIfGoto = (labelName: string | null) => {
  if (labelName == null) error('label is not found')
  const functionName = StackManager.getCurrentFunctionName()
  return `// if-goto ${
    functionName && `${functionName}$`
  }${labelName}\n@SP\nM=M-1\nA=M\nD=M\n@${
    functionName && `${functionName}$`
  }${labelName}\nD;JNE`
}

export const writeGoto = (labelName: string | null) => {
  if (labelName == null) error('label is not found')
  const functionName = StackManager.getCurrentFunctionName()
  return `// goto ${functionName && `${functionName}$`}${labelName}\n@${
    functionName && `${functionName}$`
  }${labelName}\n0;JMP`
}

export const writeFunction = (
  labelName: string | null,
  sig: string | null,
  local: string | null,
) => {
  if (labelName == null) return error('label is not found')
  if (sig == null) return error(`sig: ${sig} is invalid.`)
  if (local == null || !isFinite(parseInt(local, 10)))
    return error(`local: ${local} on ${sig} is not int.`)
  const code = new Array(parseInt(local, 10))
    .fill('')
    .reduce((acc) => `${acc}\n@SP\nA=M\nM=0\n@SP\nM=M+1`, '')
  StackManager.setCurrentFunctionName(sig)
  return `// function ${sig}\n(${sig})${code}`
}

export const writeCall = (
  sig: string | null,
  local: string | null,
  callId: string,
) => {
  if (sig == null) return error(`sig: ${sig} is invalid.`)
  if (local == null || !isFinite(parseInt(local, 10)))
    return error(`local: ${local} on ${sig} is not int.`)
  return `// call ${sig}\n@RETURN${callId}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@LCL\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@ARG\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@THIS\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@THAT\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\nD=M\n@${local}\nD=D-A\n@5\nD=D-A\n@ARG\nM=D\n@SP\nD=M\n@LCL\nM=D\n@${sig}\n0;JMP\n(RETURN${callId})`
}

export const writeReturn = () => {
  return `// return\n@LCL\nD=M\n@frame\nM=D\n@5\nD=D-A\nA=D\nD=M\n@ret\nM=D\n@SP\nM=M-1\nA=M\nD=M\n@ARG\nA=M\nM=D\n@ARG\nD=M+1\n@SP\nM=D\n@frame\nD=M\n@1\nD=D-A\nA=D\nD=M\n@THAT\nM=D\n@frame\nD=M\n@2\nD=D-A\nA=D\nD=M\n@THIS\nM=D\n@frame\nD=M\n@3\nD=D-A\nA=D\nD=M\n@ARG\nM=D\n@frame\nD=M\n@4\nD=D-A\nA=D\nD=M\n@LCL\nM=D\n@ret\nA=M\n0;JMP`
}

export const CodeWriter = (
  command: string,
  className?: string,
  ...arg: (string | null)[]
) => {
  const commandType = getCommandType(command)
  const code: string[] = []
  if (commandType === C_PUSH || commandType === C_POP) {
    const pushPopCode = writePushPop(command, arg[0], arg[1], className)
    pushPopCode != null && code.push(pushPopCode)
  }
  if (commandType === C_LABEL) {
    const labelCode = writeLabel(arg[0])
    labelCode != null && code.push(labelCode)
  }
  if (commandType === C_GOTO) {
    const gotoCode = writeGoto(arg[0])
    gotoCode != null && code.push(gotoCode)
  }
  if (commandType === C_IF) {
    const ifGotoCode = writeIfGoto(arg[0])
    ifGotoCode != null && code.push(ifGotoCode)
  }
  if (commandType === C_FUNCTION) {
    const functionCode = writeFunction(command, arg[0], arg[1])
    functionCode != null && code.push(functionCode)
  }
  if (commandType === C_CALL) {
    const callId = StackManager.getCallId()
    const callCode = writeCall(arg[0], arg[1], `${callId}`)
    StackManager.addCallId()
    callCode != null && code.push(callCode)
  }
  if (commandType === C_RETURN) {
    const returnCode = writeReturn()
    code.push(returnCode)
  }
  if (commandType === C_ARITHMETIC) {
    const arithmeticCode = writeArithmetic(command)
    arithmeticCode && code.push(arithmeticCode)
  }
  return code.join('\n')
}
