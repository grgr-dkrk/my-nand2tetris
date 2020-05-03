import { Parser } from './parser'
import { checkArgv, getFileText } from './util'
import fs from 'fs'
import path from 'path'

const main = () => {
  checkArgv(process.argv)
  const text = getFileText(process.argv[2])
  const parserText = Parser(text)
  fs.writeFileSync(path.resolve(process.argv[3] || process.argv[2].replace('.asm', '.hack')), parserText.join('\n'))
}

main()
