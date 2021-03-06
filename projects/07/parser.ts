import { CodeWriter } from './codeWriter'
import { StackManager } from './stack'

export const formatLine = (line: string) =>
  line.trimLeft().split('//')[0].trim()
export const getCommand = (spilitedLine: string[]) =>
  spilitedLine && spilitedLine[0] ? spilitedLine[0] : null
export const getArg1 = (spilitedLine: string[]) =>
  spilitedLine && spilitedLine[1] ? spilitedLine[1] : null
export const getArg2 = (spilitedLine: string[]) =>
  spilitedLine && spilitedLine[2] ? spilitedLine[2] : null


export const iterateLines = (lines: string[], className?: string) => {
  const dest: unknown[] = []
  lines.forEach((line_, index) => {
    const line = formatLine(line_)
    if (!line) return
    const spilitedLine = line.split(' ')
    const [command, arg1, arg2] = [
      getCommand(spilitedLine),
      getArg1(spilitedLine),
      getArg2(spilitedLine),
    ]
    console.log(
      `line${index}: Command=${command} arg1=${arg1 || 'none'} arg2=${
        arg2 || 'none'
      }`,
    )
    if (!command) return
    const code = CodeWriter(command, className, arg1, arg2)
    if (!code) return
    dest.push(code)
  })
  StackManager.setCurrentFunctionName('')
  return dest.join('\n')
}

export const Parser = (body: string, className?: string) => {
  const lines = body.split('\n')
  return iterateLines(lines, className)
}
