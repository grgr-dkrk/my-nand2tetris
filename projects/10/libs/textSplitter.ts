import { SYMBOLS } from "./constants";

export const formatLine = (line: string) =>
  line.trimLeft().split("//")[0].trim();
export const splitWords = (line: string) => line.split(" ");

export const splitSymbols = (token: string) => {
  return token.split(SYMBOLS).filter((t) => t);
};

export const Splitter = (body: string) => {
  const tokens: string[][] = [];
  body.split("\n").forEach((line_) => {
    const line = formatLine(line_);
    line &&
      !line.startsWith("*") &&
      !line.startsWith("/*") &&
      tokens.push(splitWords(line));
  });
  const flattenTokens = ([] as string[]).concat(...tokens);
  return ([] as string[]).concat(...flattenTokens.map(splitSymbols));
};
