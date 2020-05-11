import { SYMBOLS, KEYWORDS } from "./constants";
import { TokenManager } from "./TokenManager";

export const TYPE_KEYWORD = "keyword" as const;
export const TYPE_SYMBOL = "symbol" as const;
export const TYPE_IDENTIFER = "identifier" as const;
export const TYPE_INT_CONST = "integerConstant" as const;
export const TYPE_STRING_CONST = "stringConstant" as const;

const KEYWORD_CLASS = "class" as const;

export const isKeyword = (token: string) => KEYWORDS.test(token);
export const isSymbol = (token: string) => SYMBOLS.test(token);
export const isInt = (token: string) => isFinite(parseInt(token, 10));
export const isStr = (token: string) => token === '"';
export const getTokenType = (token: string) => {
  if (isKeyword(token)) return TYPE_KEYWORD;
  if (isSymbol(token)) return TYPE_SYMBOL;
};
export const isClass = (token: string) => token === KEYWORD_CLASS;
export const parseClass = () => {};

export const setKeyWord = () => {
  TokenManager.setTokenMap(
    `${TYPE_KEYWORD}${TokenManager.getIndex()}`,
    TokenManager.getToken()
  );
};

export const setSymbol = () => {
  TokenManager.setTokenMap(
    `${TYPE_SYMBOL}${TokenManager.getIndex()}`,
    TokenManager.getToken()
  );
};

export const setStr = () => {
  TokenManager.addIndex();
  const strs: string[] = [];
  do {
    strs.push(TokenManager.getToken());
    TokenManager.addIndex();
  } while (TokenManager.getToken() !== '"');
  TokenManager.setTokenMap(
    `${TYPE_STRING_CONST}${TokenManager.getIndex()}`,
    strs.join(" ")
  );
};

export const setInt = () => {
  TokenManager.setTokenMap(
    `${TYPE_INT_CONST}${TokenManager.getIndex()}`,
    TokenManager.getToken()
  );
};

export const setIdentifier = () => {
  TokenManager.setTokenMap(
    `${TYPE_IDENTIFER}${TokenManager.getIndex()}`,
    TokenManager.getToken()
  );
};

export const Tokenizer = (tokens: string[]) => {
  const advance = () => {
    TokenManager.setTokenList(tokens);
    if (isKeyword(TokenManager.getToken())) {
      setKeyWord();
    } else if (isStr(TokenManager.getToken())) {
      setStr();
    } else if (isSymbol(TokenManager.getToken())) {
      setSymbol();
    } else if (isInt(TokenManager.getToken())) {
      setInt();
    } else {
      setIdentifier();
    }
    TokenManager.addIndex();
    if (TokenManager.getIndex() <= tokens.length - 1) advance();
  };
  if (TokenManager.getIndex() <= tokens.length - 1) advance();
  return TokenManager.getTokenMap()
};
