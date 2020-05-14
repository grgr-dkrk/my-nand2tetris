import { TokenManager } from "../Tokenizer/TokenManager"
import { CompileManager } from "../CompilationEngine/CompileManager"
import { SymbolTable } from "../SymbolTable"

export const Initiarize = (filePath: string) => {
  TokenManager.setTokenList([])
  TokenManager.resetTokenMap()
  TokenManager.resetIndex()
  CompileManager.resetCompileXMLList()
  CompileManager.resetCompileList()
  SymbolTable.reset()
  console.log(`initiarized: ${filePath}`)
}