import fs from 'fs'

export const error = (message?: string) => {
  console.error(`error: ${message}`)
  process.exit(1)
}

export const checkArgv = (argv: string[]) => {
  if (!argv || !argv[2]) error('not found')
  console.log('argv: ok')
}

export const getFileText = (path: string) => {
  if (!path.endsWith('asm')) error('not asm')
  const readFile = fs.readFileSync(path, { encoding: 'utf-8' })
  console.log('getFileText: ok')
  return readFile
}

export const convertIntToBinaryString = (str: string): string | void => {
  const int = parseInt(str, 10)
  if (!isFinite(int)) return
  return int.toString(2).padStart(16, '0')
}