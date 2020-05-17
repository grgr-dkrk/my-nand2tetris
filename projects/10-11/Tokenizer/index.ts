import {
  TYPE_KEYWORD,
  TYPE_SYMBOL,
  TYPE_STRING_CONST,
  TYPE_INT_CONST,
  TYPE_IDENTIFER,
} from "../libs/constants";
import { TokenManager } from "./TokenManager";
import { isKeyword, isStr, isInt, isSymbol } from "./utils";

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
  return TokenManager.getTokenMap();
};
