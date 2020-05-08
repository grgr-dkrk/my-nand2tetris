import { writeCall } from './codeWriter'

export const createBootstrap = () => {
  // SP=256 スタックポインタを 0x0100 に初期化する
  // call Sys.init // (変換されたコードの)Sys.init を実行する
  const lines: string[] = []
  lines.push(`@256\nD=A\n@SP\nM=D`)
  const bootStrap = writeCall('Sys.init', '0', 'bootstrap')
  bootStrap && lines.push(bootStrap)
  return lines.join(`\n`)
}
