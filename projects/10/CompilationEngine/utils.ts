import { TokenManager } from "../Tokenizer/TokenManager";
import { CompileManager } from "./CompileManager";
import { Command, Segment, VMWriter } from "../VMWriter";
import {
  TYPE_INT_CONST,
  TYPE_STRING_CONST,
  TYPE_KEYWORD,
} from "../libs/constants";
import { SymbolKind, SymbolTable } from "../SymbolTable";

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

export const addCompileXMLList = (tagName: string, tagPos: TagPos = "both") => {
  const value = getTokenValue();
  CompileManager.addCompileXMLList(
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
export const isDot = () => getTokenValue() === ".";
export const isMethod = () => getTokenValue() === "method";

export const isIntergerConstant = () => getTokenKey() === TYPE_INT_CONST;
export const isStringConstant = () => getTokenKey() === TYPE_STRING_CONST;
export const isKeywordConstant = () =>
  getTokenKey() === TYPE_KEYWORD &&
  (getTokenValue() === "true" ||
    getTokenValue() === "false" ||
    getTokenValue() === "null" ||
    getTokenValue() === "this");

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

export const convertOpToCommand = (arg?: string): Command => {
  const statement = arg || getTokenValue()
  switch (statement) {
    case "+":
      return Command.Add;
    case "-":
      return Command.Sub;
    case "&amp;":
      return Command.And;
    case "|":
      return Command.Or;
    case "&lt;":
      return Command.Lt;
    case "&gt;":
      return Command.Gt;
    case "=":
      return Command.Eq;
    default:
      throw new Error(`invalid op: ${getTokenValue()}`);
  }
};

export const convertUnaryOpToCommand = (arg?: string): Command => {
  const statement = arg || getTokenValue()
  switch (statement) {
    case "-":
      return Command.Neg;
    case "~":
      return Command.Not;
    default:
      throw new Error(`invalid unaryop: ${statement}`);
  }
};

export const convertedKindToSegment = (kind: SymbolKind): Segment => {
  switch (kind) {
    case SymbolKind.Argument:
      return Segment.Arg;
    case SymbolKind.Var:
      return Segment.Local;
    case SymbolKind.Field:
      return Segment.This;
    case SymbolKind.Static:
      return Segment.Static;
  }
};

export const startSubroutine = () => {
  SymbolTable.startSubroutine();
  VMWriter.resetIfIndex();
}