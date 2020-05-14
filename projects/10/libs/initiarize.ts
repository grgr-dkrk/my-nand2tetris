import { TokenManager } from "../Tokenizer/TokenManager"
import { CompileManager } from "../CompilationEngine/CompileManager"

export const Initiarize = (filePath: string) => {
  TokenManager.setTokenList([])
  TokenManager.resetTokenMap()
  TokenManager.resetIndex()
  CompileManager.resetCompileList()
  console.log(`initiarized: ${filePath}`)
}