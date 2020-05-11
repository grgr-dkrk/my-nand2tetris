import { TokenManager } from "./TokenManager";
import { XMLManager } from "./XMLManager";

type TagPos = "both" | "open" | "close";

export const advance = () => {
  TokenManager.nextTokenMap();
};

export const getTokenKey = () => {
  const [key, _] = TokenManager.getNextTokenMap().value;
  return key.replace(/[0-9]/g, "");
};

export const getTokenValue = () => {
  const [_, value] = TokenManager.getNextTokenMap().value;
  return value;
};

export const isClassVarDec = () => /(static|field)/.test(getTokenValue());

export const isVarDec = () => /var\b/.test(getTokenValue());

export const isSubroutine = () =>
  /(constructor|function|method)/.test(getTokenValue());

export const isEndComma = () => getTokenValue() === ";";
export const isStartParenthesis = () => getTokenValue() === "(";
export const isEndParenthesis = () => getTokenValue() === ")";
export const isStartBrace = () => getTokenValue() === "{";
export const isEndBrace = () => getTokenValue() === "}";

export const addXMLList = (tagName: string, tagPos: TagPos = "both") => {
  const value = getTokenValue();
  XMLManager.addXMLList(
    `${tagPos !== "close" ? `<${tagName}>` : ""}${
      tagPos === "both" ? value : ""
    }${tagPos !== "open" ? `</${tagName}>` : ""}`
  );
};

export const compileClass = () => {
  addXMLList("class", "open");
  addXMLList("keyword");
  while (true) {
    advance();
    if (isEndBrace()) {
      break;
    }
    // classVarDec
    if (isClassVarDec()) {
      compileClassVarDec();
      continue;
    }
    // classVarDec
    if (isVarDec()) {
      compileVarDec();
      continue;
    }
    // subroutineDec
    if (isSubroutine()) {
      compileSubroutine();
      continue;
    }
    addXMLList(getTokenKey());
  }
  addXMLList("symbol");
  addXMLList("class", "close");
};

// classVarDec
export const compileClassVarDec = () => {
  addXMLList("classVarDec", "open");
  addXMLList(getTokenKey()); // static | field
  while (!isEndComma()) {
    advance();
    addXMLList(getTokenKey());
  }
  addXMLList("classVarDec", "close");
};

// varDec
export const compileVarDec = () => {
  addXMLList("varDec", "open");
  addXMLList(getTokenKey()); // var
  while (!isEndComma()) {
    advance();
    addXMLList(getTokenKey());
  }
  addXMLList("varDec", "close");
};

export const compileSubroutineBody = () => {
  addXMLList("subroutineBody", "open");
  addXMLList(getTokenKey()); // {
  while (!isEndBrace()) {
    advance();
    if (isVarDec()) {
      compileVarDec();
      continue;
    }
    addXMLList(getTokenKey());
  }
  addXMLList("subroutineBody", "close");
};

export const compileParameterList = () => {
  // compileParameterList の終端記号はタグの外に置く
  addXMLList(getTokenKey()); // (
  addXMLList("parameterList", "open");
  advance();
  while (!isEndParenthesis()) {
    addXMLList(getTokenKey());
    advance();
  }
  addXMLList("parameterList", "close");
  addXMLList(getTokenKey()); // )
};
export const compileSubroutine = () => {
  addXMLList("subroutineDec", "open");
  addXMLList("keyword");
  while (true) {
    advance();
    // parameterList
    if (isStartParenthesis()) {
      compileParameterList();
      continue;
    }
    // subroutineBody
    if (isStartBrace()) {
      compileSubroutineBody();
      break;
    }
    addXMLList(getTokenKey());
  }
  addXMLList("subroutineDec", "close");
};
export const compileStatements = () => {};
export const compileDo = () => {};
export const compileLet = () => {};
export const compileWhile = () => {};
export const compileReturn = () => {};
export const compileIf = () => {};
export const compileExpression = () => {};
export const compileTerm = () => {};
export const compileExpressionList = () => {};

export const iterateComplation = () => {
  const [key, value] = TokenManager.getNextTokenMap().value;
  const formattedKey = key.replace(/[0-9]/g, "");
  if (formattedKey === "keyword" && value === "class") {
    compileClass();
  }
  if (formattedKey === "keyword" && value === "field") {
    XMLManager.addXMLList(formattedKey);
  }
  advance();
};

export const Compilation = (tokenMap: Map<string, string>) => {
  let index = 0;
  const dest: any[] = [];
  TokenManager.createTokenMapIterator();
  while (!TokenManager.getIsNextTokenMapDone()) {
    iterateComplation();
  }
  console.log(XMLManager.getXMLList());
  return XMLManager.getXMLList().join('\n')
};
