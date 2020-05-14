import { TokenManager } from "../Tokenizer/TokenManager"
import { CompileManager } from "../CompilationEngine/CompileManager"
import { SymbolTable } from "../SymbolTable"

export const Initiarize = (filePath: string) => {
  TokenManager.reset()
  CompileManager.resetCompileXMLList()
  CompileManager.resetCompileList()
  SymbolTable.reset()
  console.log(`initiarized: ${filePath}`)
}