import { TokenManager } from "../Tokenizer/TokenManager"
import { XMLManager } from "../CompilationEngine/XMLManager"

export const Initiarize = (filePath: string) => {
  TokenManager.setTokenList([])
  TokenManager.resetTokenMap()
  TokenManager.resetIndex()
  XMLManager.resetXMLList()
  console.log(`initiarized: ${filePath}`)
}