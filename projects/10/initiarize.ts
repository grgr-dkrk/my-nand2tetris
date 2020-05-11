import { TokenManager } from "./TokenManager"
import { XMLManager } from "./XMLManager"

export const Initiarize = (filePath: string) => {
  TokenManager.setTokenList([])
  TokenManager.resetTokenMap()
  TokenManager.resetIndex()
  XMLManager.resetXMLList()
  console.log(`initiarized: ${filePath}`)
}