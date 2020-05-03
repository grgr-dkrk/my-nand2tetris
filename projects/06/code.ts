import { error } from './util'

const HEADER = '111' as const

// 119ページのハードコーディング
const COMP_MAPS: [string, string][] = [
  // a=0
  ['0', '0101010'],
  ['1', '0111111'],
  ['-1', '0111010'],
  ['D', '0001100'],
  ['A', '0110000'],
  ['!D', '0001101'],
  ['!A', '0110001'],
  ['-D', '0001111'],
  ['-A', '0110011'],
  ['D+1', '0011111'],
  // ['1+D', '0011111'],
  ['A+1', '0110111'],
  // ['1+A', '0110111'],
  ['D-1', '0001110'],
  ['A-1', '0110010'],
  ['D+A', '0000010'],
  // ['A+D', '0000010'],
  ['D-A', '0010011'],
  ['A-D', '0000111'],
  ['D&A', '0000000'],
  // ['A&D', '0000000'],
  ['D|A', '0010101'],
  // ['A|D', '0010101'],

  // a=1
  ['M', '1110000'],
  ['!M', '1110001'],
  ['-M', '1110011'],
  ['M+1', '1110111'],
  // ['1+M', '1110111'],
  ['M-1', '1110010'],
  ['D+M', '1000010'],
  // ['M+D', '1000010'],
  ['D-M', '1010011'],
  ['M-D', '1000111'],
  ['D&M', '1000000'],
  // ['M&D', '1000000'],
  ['D|M', '1010101'],
  // ['M|D', '1010101'],
]
type Jump = 'JGT' | 'JEQ' | 'JGE' | 'JLT' | 'JNE' | 'JLE' | 'JMP'

const JumpMap = {
  JGT: '001',
  JEQ: '010',
  JGE: '011',
  JLT: '100',
  JNE: '101',
  JLE: '110',
  JMP: '111',
} as const

// comp
export const setComp = (mnemonic: string) => {
  const comp = new Map(COMP_MAPS).get(mnemonic.trim())
  if (!comp) return error(`Error setComp, mnemonic is inValid: ${mnemonic}`)
  return comp
}

// dist
export const checkDist = (reg: RegExp, mnemonic: string): '1' | '0' =>
  reg.test(mnemonic) ? '1' : '0'

export const setDest = (mnemonic: string) => {
  return `${checkDist(/A/i, mnemonic)}${checkDist(/D/i, mnemonic)}${checkDist(
    /M/i,
    mnemonic,
  )}`
}

// jump
export const setJump = (key?: Jump | null) => {
  return (key && JumpMap[key.trim() as Jump]) || '000' // null
}

export const GenerateCode = (line: string) => {
  const isJump = /;/.test(line)
  const mnemonic = line.split(/=|;/)
  return `${HEADER}${setComp(!isJump ? mnemonic[1] : mnemonic[0])}${setDest(
    !isJump ? mnemonic[0] : '',
  )}${setJump(isJump ? (mnemonic[1] as Jump) : null)}`
}
