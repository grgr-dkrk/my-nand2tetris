import { TokenManager } from "../Tokenizer/TokenManager";
import { CompileManager } from "./CompileManager";

type TagPos = "both" | "open" | "close";

export const getTokenKey = () => {
  const key = TokenManager.getNextTokenMap()[0];
  return key.replace(/[0-9]/g, "");
};

export const getTokenValue = () => {
  const value = TokenManager.getNextTokenMap()[1];
  return value;
};

export const advance = () => {
  TokenManager.nextTokenMap();
};

export const lookahead = (): [string, string] | null => {
  const value = TokenManager.getLookAheadTokenMap();
  return value || null;
};

export const isClassVarDec = () => /(static|field)\b/.test(getTokenValue());
export const isVarDec = () => /var\b/.test(getTokenValue());
export const isSubroutine = () =>
  /(constructor|function|method)\b/.test(getTokenValue());
export const isStatement = () => {
  /(let|if|while|do|return)\b/.test(getTokenValue());
};
export const isOp = () => /(\+|\-|\*|\/|\&|\||\<|\>|\=)/.test(getTokenValue());

export const addCompileList = (tagName: string, tagPos: TagPos = "both") => {
  const value = getTokenValue();
  CompileManager.addCompileList(
    `${tagPos !== "close" ? `<${tagName}>` : ""}${
      tagPos === "both" ? value : ""
    }${tagPos !== "open" ? `</${tagName}>` : ""}`
  );
};

export const isStartParenthesis = () => getTokenValue() === "(";
export const isEndParenthesis = () => getTokenValue() === ")";
export const isStartBrace = () => getTokenValue() === "{";
export const isEndBrace = () => getTokenValue() === "}";
export const isStartBracket = () => getTokenValue() === "[";
export const isEndBracket = () => getTokenValue() === "]";
export const isEqualSymbol = () => getTokenValue() === "=";
export const isSemicolonSymbol = () => getTokenValue() === ";";
export const isCommaSymbol = () => getTokenValue() === ",";
export const isPipeSymbol = () => getTokenValue() === "|";

export const hasDotLookAhead = () => {
  const lookAhead = lookahead();
  return !!lookAhead && lookAhead[1] === ".";
};
export const hasStartBracketAhead = () => {
  const lookAhead = lookahead();
  return !!lookAhead && lookAhead[1] === "[";
};
export const hasStartParenthesisAhead = () => {
  const lookAhead = lookahead();
  return !!lookAhead && lookAhead[1] === "(";
};
export const hasUnaryOp = () => {
  const lookAhead = getTokenValue();
  return !!lookAhead && /(\-|\~)/.test(lookAhead);
};

export const hasSymbolKey = () => getTokenKey() === "symbol";
export const hasIdentifierKey = () => getTokenKey() === "identifier";
