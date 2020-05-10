import { checkArgv, getFileDir } from './util'
import path from 'path'
import fs, { readFileSync } from 'fs'
import { Tokenizer } from './tokenizer'
import { Splitter } from './splitter'

const main = () => {
  checkArgv(process.argv)
  const lines: string[] = []
  const root = process.argv[2]
  const dir = getFileDir(root)
  dir.forEach((filePath) => {
    if (!filePath.endsWith('Main.jack')) return
    const file = fs.readFileSync(path.resolve(root, filePath), {
      encoding: 'utf-8',
    })
    console.log(Tokenizer(Splitter(file), () => ''))
  })
  // fs.writeFileSync(
  //   path.resolve(process.argv[2] + process.argv[3] + `.asm`),
  //   lines.join(`\n`),
  // )
}

main()
