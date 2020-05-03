import { GenerateCode } from './code'
import { SymbolTable } from './symboltable'

export const formatLine = (line: string) => line.trimLeft().split('//')[0]
export const isACommand = (line: string) => /\@/.test(line) // @Xxx
export const isCCommand = (line: string) => /\@|=|;/.test(line) // dest=comp;jump
export const isLCommand = (line: string) => /\((.+)\)/.test(line) // (Xxx)
export const getASymbol = (line: string) => line.split('@')[1]
export const convertToByte = (int: number) => int.toString(2).padStart(16, '0')

export const convertACommandToByte = (line: string) => {
  const aSymbol = getASymbol(line)
  const parsedSymbol = parseInt(aSymbol, 10)
  if (isFinite(parsedSymbol)) {
    return convertToByte(parsedSymbol)
  } else {
    const address = SymbolTable.getAddress(aSymbol)
    if (address == null) {
      const index = SymbolTable.getIndex()
      SymbolTable.addEntry(aSymbol, index)
      SymbolTable.addIndex()
      return convertToByte(index)
    }
    return convertToByte(address)
  }
}

const saveSymbols = (lines: string[]) => {
  let romAddress = 0
  lines.forEach((line_, index) => {
    const line = formatLine(line_)
    if (line) {
      console.log(`${index}: ${line}`)
      if (isLCommand(line)) {
        SymbolTable.addEntry(line.match(/\((.+)\)/)![1], romAddress)
      } else {
        romAddress++
      }
    }
  })
  console.log(SymbolTable.getValues())
}

const createBytes = (lines: string[]) => {
  const bytes: string[] = []
  lines.forEach((line_, index) => {
    const line = formatLine(line_)
    if (line) {
      console.log(`${index}: ${line}`)
      // A 命令
      if (isACommand(line)) {
        bytes.push(convertACommandToByte(line.trim()))
      } else if (isLCommand(line)) {
        /* L は何もしない */
      } else {
        // C 命令
        bytes.push(GenerateCode(line.trim()))
      }
    }
  })
  return bytes
}

export const Parser = (body: string) => {
  const lines = body.split('\n')
  saveSymbols(lines)
  const bytes = createBytes(lines)
  console.log(bytes)
  console.log(SymbolTable.getValues())
  return bytes
}
