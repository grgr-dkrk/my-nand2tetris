import { checkArgv, getFileDir } from './util'
import { Parser } from './parser'
import path from 'path'
import fs, { readFileSync } from 'fs'
import { createBootstrap } from './bootstrap'
import { SYS_INIT } from './types'

const main = () => {
  checkArgv(process.argv)
  const lines: string[] = []
  const root = process.argv[2]
  const dir = getFileDir(root)
  const hasSysInit = dir.find((filePath) => filePath === SYS_INIT)
  // bootstrap
  if (hasSysInit) {
    lines.push(createBootstrap())
  }
  // vm classes
  dir.forEach((filePath) => {
    if (!filePath.endsWith('.vm')) return
    if (filePath === SYS_INIT) return
    const file = fs.readFileSync(path.resolve(root, filePath), {
      encoding: 'utf-8',
    })
    const className = filePath.replace('.vm', '')
    console.log(`parse static: ${className}`)
    lines.push(Parser(file, className))
  })
  // sys
  if (hasSysInit) {
    const sys = readFileSync(path.resolve(root, SYS_INIT), {
      encoding: 'utf-8',
    })
    lines.push(Parser(sys))
  }
  fs.writeFileSync(
    path.resolve(process.argv[2] + process.argv[3] + `.asm`),
    lines.join(`\n`),
  )
  console.log(lines)
}

main()
