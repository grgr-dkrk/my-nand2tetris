import { error } from './util'

// 120ページのハードコーディング
const SYMBOLS: [string, number][] = [
  ['SP', 0],
  ['LCL', 1],
  ['ARG', 2],
  ['THIS', 3],
  ['THAT', 4],
  ['R0', 0],
  ['R1', 1],
  ['R2', 2],
  ['R3', 3],
  ['R4', 4],
  ['R5', 5],
  ['R6', 6],
  ['R7', 7],
  ['R8', 8],
  ['R9', 9],
  ['R10', 10],
  ['R11', 11],
  ['R12', 12],
  ['R13', 13],
  ['R14', 14],
  ['R15', 15],
  ['SCREEN', 16384],
  ['KBD', 24576],
]

export const INITIAL_ADDRESS_INDEX = 16

export const SymbolTable = (() => {
  let tables = new Map<string, number>(SYMBOLS)
  let index = INITIAL_ADDRESS_INDEX
  return {
    addEntry(symbol: string, address: number) {
      tables = tables.set(symbol, address)
    },
    contains(symbol: string) {
      return [...tables].some(([key]) => key === symbol)
    },
    getAddress(symbol: string) {
      const address = tables.get(symbol)
      return address
    },
    getValues() {
      return tables
    },
    getIndex() {
      return index
    },
    addIndex() {
      index++
    },
  }
})()
