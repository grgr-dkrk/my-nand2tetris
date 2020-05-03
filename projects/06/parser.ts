import { error } from './util'
import { GenerateCode } from './code'

export const formatLine = (line: string) => line.trimLeft().split('//')[0]
export const isACommand = (line: string) => /\@/.test(line)

export const convertToBits = (line: string, index?: number) => {
  const splittedLine = line.split('@')
  if (
    !splittedLine ||
    splittedLine[1] == null ||
    !isFinite(parseInt(splittedLine[1], 10))
  )
    error(`Compiled Error on line: ${index || 'unknown'} invalid param`)
  const int = parseInt(splittedLine[1], 10)
  return int.toString(2).padStart(16, '0')
}

export const Parser = (body: string) => {
  const lines = body.split('\n')
  const bytes: string[] = []
  lines.forEach((line_, index) => {
    const line = formatLine(line_)
    if (line) {
      console.log(`${index}: ${line}`)
      // A 命令
      if (isACommand(line)) {
        bytes.push(convertToBits(line, index))
      } else {
        // C 命令
        bytes.push(GenerateCode(line))
      }
    }
  })
  console.log(bytes)
  return bytes
}
