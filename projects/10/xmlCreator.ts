export const XMLCreator = (tokenList: Map<string, string>) => {
  const lines: string[] = []
  lines.push(`<tokens>`)
  tokenList.forEach((value, key) => {
    const formattedKey = key.replace(/[0-9]/g, '')
    lines.push(`<${formattedKey}>${value}</${formattedKey}>`)
  })
  lines.push(`</tokens>`)
  return lines.join('\n')
}