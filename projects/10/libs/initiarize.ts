import { TokenManager } from "../Tokenizer/TokenManager"
import { CompileManager } from "../CompilationEngine/CompileManager"
import { SymbolTable } from "../SymbolTable"
import { VMWriter } from "../VMWriter"

export const Initiarize = (filePath: string) => {
  TokenManager.reset()
  CompileManager.resetCompileXMLList()
  CompileManager.resetCompileList()
  SymbolTable.reset()
  VMWriter.reset()
  console.log(`initiarized: ${filePath}`)
}