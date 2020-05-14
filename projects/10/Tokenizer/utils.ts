import {
  KEYWORDS,
  SYMBOLS,
  TYPE_KEYWORD,
  TYPE_SYMBOL,
  KEYWORD_CLASS,
} from "../libs/constants";

export const isKeyword = (token: string) => KEYWORDS.test(token);
export const isSymbol = (token: string) => SYMBOLS.test(token);
export const isInt = (token: string) => isFinite(parseInt(token, 10));
export const isStr = (token: string) => token === '"';
export const getTokenType = (token: string) => {
  if (isKeyword(token)) return TYPE_KEYWORD;
  if (isSymbol(token)) return TYPE_SYMBOL;
};
export const isClass = (token: string) => token === KEYWORD_CLASS;

export const escapeJackString = (token: string) =>
  token.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;");