import { TokenManager } from "../Tokenizer/TokenManager";
import { XMLManager } from "./XMLManager";
import {
  addXMLList,
  advance,
  isEndBrace,
  isClassVarDec,
  isVarDec,
  isSubroutine,
  getTokenKey,
  isSemicolonSymbol,
  isEndParenthesis,
  isStartParenthesis,
  isStartBrace,
  getTokenValue,
  isStartBracket,
  isEndBracket,
  isEqualSymbol,
  hasUnaryOp,
  isOp,
  isCommaSymbol,
  hasDotLookAhead,
  hasStartBracketAhead,
  hasIdentifierKey,
} from "./utils";

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
  if (hasUnaryOp()) {
    addXMLList("term", "open");
    addXMLList(getTokenKey()); // unaryOp
    advance();
    compileTerm();
    addXMLList("term", "close");
    advance();
  }
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

export const compileIdentifierOnTerm = () => {
  if (hasDotLookAhead()) {
    advance();
    addXMLList(getTokenKey()); //.
    advance();
    addXMLList(getTokenKey()); // new
    advance();
    addXMLList(getTokenKey()); // (
    compileExpressionList();
    addXMLList(getTokenKey()); // )
  }
  if (hasStartBracketAhead()) {
    advance();
    addXMLList(getTokenKey()); // [
    advance();
    compileExpression(isEndBracket);
    addXMLList(getTokenKey()); // ]
  }
};

// term
export const compileTerm = () => {
  addXMLList("term", "open");
  addXMLList(getTokenKey());
  if (hasIdentifierKey()) compileIdentifierOnTerm();
  if (isStartParenthesis()) {
    // (
    advance();
    compileExpression(isEndParenthesis);
    addXMLList(getTokenKey()); // )
  }
  addXMLList("term", "close");
};

export const iterateComplation = () => {
  if (getTokenKey() === "keyword" && getTokenValue() === "class") {
    compileClass();
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
