import { TokenManager } from "./TokenManager";
import { XMLManager } from "./XMLManager";

type TagPos = "both" | "open" | "close";

export const getTokenKey = () => {
  const [key, _] = TokenManager.getNextTokenMap().value;
  return key.replace(/[0-9]/g, "");
};

export const getTokenValue = () => {
  const [_, value] = TokenManager.getNextTokenMap().value;
  return value;
};

export const advance = () => {
  TokenManager.nextTokenMap();
};

export const isClassVarDec = () => /(static|field)\b/.test(getTokenValue());
export const isVarDec = () => /var\b/.test(getTokenValue());
export const isSubroutine = () =>
  /(constructor|function|method)\b/.test(getTokenValue());
export const isStatement = () => {
  /(let|if|while|do|return)\b/.test(getTokenValue());
};
export const isOp = () => /(\+|\-|\*|\/|\&|\||\<|\>|\=)/.test(getTokenValue());

export const addXMLList = (tagName: string, tagPos: TagPos = "both") => {
  const value = getTokenValue();
  XMLManager.addXMLList(
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

export const hasSymbolKey = () => getTokenKey() === "symbol";
export const hasIdentifierKey = () => getTokenKey() === "identifier";

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
  while (!isSemicolonSymbol()) {
    advance();
    addXMLList(getTokenKey());
  }
  addXMLList("classVarDec", "close");
};

// varDec
export const compileVarDec = () => {
  addXMLList("varDec", "open");
  addXMLList(getTokenKey()); // var
  while (!isSemicolonSymbol()) {
    advance();
    addXMLList(getTokenKey());
  }
  addXMLList("varDec", "close");
};

// subroutineBody
export const compileSubroutineBody = () => {
  addXMLList("subroutineBody", "open");
  addXMLList(getTokenKey()); // {
  while (!isEndBrace()) {
    advance();
    if (isVarDec()) {
      compileVarDec();
      continue;
    }
    compileStatements();
  }
  addXMLList(getTokenKey()); // }
  addXMLList("subroutineBody", "close");
};

// parameterList
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

// subRoutine
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

// statements
export const compileStatements = () => {
  addXMLList("statements", "open");
  console.log(`token: ${getTokenValue()}`);
  while (!isEndBrace()) {
    switch (getTokenValue()) {
      case "let":
        compileLet();
        continue;
      case "if":
        compileIf();
        continue;
      case "while":
        compileWhile();
        continue;
      case "do":
        compileDo();
        continue;
      case "return":
        compileReturn();
        continue;
      default:
        console.log(`statements is break: ${getTokenValue()}`);
        break;
    }
    advance();
  }
  addXMLList("statements", "close");
};

// let
export const compileLet = () => {
  addXMLList("letStatement", "open");
  addXMLList(getTokenKey()); // let
  while (!isSemicolonSymbol()) {
    advance();
    if (isStartBracket()) {
      addXMLList(getTokenKey()); // [
      advance();
      compileExpression(isEndBracket);
      addXMLList(getTokenKey()); // ]
      continue;
    }
    if (isEqualSymbol()) {
      addXMLList(getTokenKey()); // =
      advance();
      compileExpression(isSemicolonSymbol);
      addXMLList(getTokenKey()); // ;
      continue;
    }
    addXMLList(getTokenKey());
  }
  addXMLList("letStatement", "close");
};

// if
export const compileIf = () => {
  addXMLList("ifStatement", "open");
  addXMLList(getTokenKey()); // if
  advance();
  addXMLList(getTokenKey()); // (
  advance();
  compileExpression(isEndParenthesis);
  addXMLList(getTokenKey()); // )
  advance();
  addXMLList(getTokenKey()); // {
  advance();
  compileStatements();
  addXMLList(getTokenKey()); // }
  advance();
  if (getTokenValue() === "else") {
    addXMLList(getTokenKey()); // else
    advance();
    addXMLList(getTokenKey()); // {
    advance();
    compileStatements();
    addXMLList(getTokenKey()); // }
    advance();
  }
  addXMLList("ifStatement", "close");
};

// do
export const compileDo = () => {
  addXMLList("doStatement", "open");
  addXMLList(getTokenKey()); // do
  // subroutineCall
  while (!isSemicolonSymbol()) {
    advance();
    if (isStartParenthesis()) {
      addXMLList(getTokenKey()); // (
      compileExpressionList();
      addXMLList(getTokenKey()); // )
      continue;
    }
    addXMLList(getTokenKey());
    console.log(`${getTokenKey()}:${getTokenValue()}`);
  }
  addXMLList("doStatement", "close");
  advance();
};

// while
export const compileWhile = () => {
  addXMLList("whileStatement", "open");
  addXMLList(getTokenKey()); // while
  advance();
  addXMLList(getTokenKey()); // (
  advance();
  compileExpression(isEndParenthesis);
  addXMLList(getTokenKey()); // )
  advance();
  addXMLList(getTokenKey()); // {
  advance();
  compileStatements();
  addXMLList(getTokenKey()); // }
  advance();
  addXMLList("whileStatement", "close");
};

// return
export const compileReturn = () => {
  addXMLList("returnStatement", "open");
  addXMLList(getTokenKey()); // return
  advance();
  if (isSemicolonSymbol()) {
    addXMLList(getTokenKey()); // ;
  } else {
    compileExpression(isSemicolonSymbol);
    addXMLList(getTokenKey()); // ;
  }
  addXMLList("returnStatement", "close");
  advance();
};

// expression
export const compileExpression = (endCondition: () => boolean) => {
  addXMLList("expression", "open");
  while (!endCondition()) {
    if (isOp()) {
      addXMLList(getTokenKey()); // op
      advance();
    }
    if (isCommaSymbol()) {
      break;
    }
    compileTerm();
    advance();
  }
  addXMLList("expression", "close");
};

// term
export const compileTerm = () => {
  addXMLList("term", "open");
  addXMLList(getTokenKey());
  addXMLList("term", "close");
};

// expressionList
export const compileExpressionList = () => {
  addXMLList("expressionList", "open");
  advance();
  while (!isEndParenthesis()) {
    if (isCommaSymbol()) {
      addXMLList(getTokenKey()); //,
      advance();
    }
    compileExpression(isEndParenthesis);
  }
  addXMLList("expressionList", "close");
};

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

export const Compilation = () => {
  TokenManager.createTokenMapIterator();
  while (!TokenManager.getIsNextTokenMapDone()) {
    iterateComplation();
  }
  console.log(XMLManager.getXMLList());
  return XMLManager.getXMLList().join("\n");
};
