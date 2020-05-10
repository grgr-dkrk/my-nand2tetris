import fs from 'fs'

export const error = (message?: string): void => {
  console.error(`error: ${message}`)
  process.exit(1)
}

export const checkArgv = (argv: string[]) => {
  if (!argv || !argv[2]) error('not found')
  console.log('argv: ok')
}

export const getFileText = (path: string) => {
  if (!path.endsWith('vm')) error('not vm')
  const readFile = fs.readFileSync(path, { encoding: 'utf-8' })
  console.log('getFileText: ok')
  return readFile
}

export const getFileDir = (path: string) => {
  const dir = fs.readdirSync(path, { encoding: 'utf-8' })
  if (!fs.statSync(path).isDirectory()) error('not dir')
  console.log('getFileText: ok')
  return dir
}

export const convertIntToBinaryString = (str: string): string | void => {
  const int = parseInt(str, 10)
  if (!isFinite(int)) return
  return int.toString(2).padStart(16, '0')
}

export const escapeJackString = (token: string) =>
  token.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;");
