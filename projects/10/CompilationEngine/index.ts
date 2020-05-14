import { TokenManager } from "../Tokenizer/TokenManager";
import { CompileManager } from "./CompileManager";
import {
  addCompileList,
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
  addCompileList("class", "open");
  addCompileList("keyword");
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
    addCompileList(getTokenKey());
  }
  addCompileList("symbol");
  addCompileList("class", "close");
};

// classVarDec
export const compileClassVarDec = () => {
  addCompileList("classVarDec", "open");
  addCompileList(getTokenKey()); // static | field
  while (!isSemicolonSymbol()) {
    advance();
    addCompileList(getTokenKey());
  }
  addCompileList("classVarDec", "close");
};

// varDec
export const compileVarDec = () => {
  addCompileList("varDec", "open");
  addCompileList(getTokenKey()); // var
  while (!isSemicolonSymbol()) {
    advance();
    addCompileList(getTokenKey());
  }
  addCompileList("varDec", "close");
};

// subroutineBody
export const compileSubroutineBody = () => {
  addCompileList("subroutineBody", "open");
  addCompileList(getTokenKey()); // {
  while (!isEndBrace()) {
    advance();
    if (isVarDec()) {
      compileVarDec();
      continue;
    }
    compileStatements();
  }
  addCompileList(getTokenKey()); // }
  addCompileList("subroutineBody", "close");
};

// parameterList
export const compileParameterList = () => {
  // compileParameterList の終端記号はタグの外に置く
  addCompileList(getTokenKey()); // (
  addCompileList("parameterList", "open");
  advance();
  while (!isEndParenthesis()) {
    addCompileList(getTokenKey());
    advance();
  }
  addCompileList("parameterList", "close");
  addCompileList(getTokenKey()); // )
};

// subRoutine
export const compileSubroutine = () => {
  addCompileList("subroutineDec", "open");
  addCompileList("keyword");
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
    addCompileList(getTokenKey());
  }
  addCompileList("subroutineDec", "close");
};

// statements
export const compileStatements = () => {
  addCompileList("statements", "open");
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
  addCompileList("statements", "close");
};

// let
export const compileLet = () => {
  addCompileList("letStatement", "open");
  addCompileList(getTokenKey()); // let
  while (!isSemicolonSymbol()) {
    advance();
    if (isStartBracket()) {
      addCompileList(getTokenKey()); // [
      advance();
      compileExpression(isEndBracket);
      addCompileList(getTokenKey()); // ]
      continue;
    }
    if (isEqualSymbol()) {
      addCompileList(getTokenKey()); // =
      advance();
      compileExpression(isSemicolonSymbol);
      addCompileList(getTokenKey()); // ;
      continue;
    }
    addCompileList(getTokenKey());
  }
  addCompileList("letStatement", "close");
};

// if
export const compileIf = () => {
  addCompileList("ifStatement", "open");
  addCompileList(getTokenKey()); // if
  advance();
  addCompileList(getTokenKey()); // (
  advance();
  compileExpression(isEndParenthesis);
  addCompileList(getTokenKey()); // )
  advance();
  addCompileList(getTokenKey()); // {
  advance();
  compileStatements();
  addCompileList(getTokenKey()); // }
  advance();
  if (getTokenValue() === "else") {
    addCompileList(getTokenKey()); // else
    advance();
    addCompileList(getTokenKey()); // {
    advance();
    compileStatements();
    addCompileList(getTokenKey()); // }
    advance();
  }
  addCompileList("ifStatement", "close");
};

// do
export const compileDo = () => {
  addCompileList("doStatement", "open");
  addCompileList(getTokenKey()); // do
  // subroutineCall
  while (!isSemicolonSymbol()) {
    advance();
    if (isStartParenthesis()) {
      addCompileList(getTokenKey()); // (
      compileExpressionList();
      addCompileList(getTokenKey()); // )
      continue;
    }
    addCompileList(getTokenKey());
    console.log(`${getTokenKey()}:${getTokenValue()}`);
  }
  addCompileList("doStatement", "close");
  advance();
};

// while
export const compileWhile = () => {
  addCompileList("whileStatement", "open");
  addCompileList(getTokenKey()); // while
  advance();
  addCompileList(getTokenKey()); // (
  advance();
  compileExpression(isEndParenthesis);
  addCompileList(getTokenKey()); // )
  advance();
  addCompileList(getTokenKey()); // {
  advance();
  compileStatements();
  addCompileList(getTokenKey()); // }
  advance();
  addCompileList("whileStatement", "close");
};

// return
export const compileReturn = () => {
  addCompileList("returnStatement", "open");
  addCompileList(getTokenKey()); // return
  advance();
  if (isSemicolonSymbol()) {
    addCompileList(getTokenKey()); // ;
  } else {
    compileExpression(isSemicolonSymbol);
    addCompileList(getTokenKey()); // ;
  }
  addCompileList("returnStatement", "close");
  advance();
};

// expression
export const compileExpression = (endCondition: () => boolean) => {
  addCompileList("expression", "open");
  if (hasUnaryOp()) {
    addCompileList("term", "open");
    addCompileList(getTokenKey()); // unaryOp
    advance();
    compileTerm();
    addCompileList("term", "close");
    advance();
  }
  while (!endCondition()) {
    if (isOp()) {
      addCompileList(getTokenKey()); // op
      advance();
    }
    if (isCommaSymbol()) {
      break;
    }
    compileTerm();
    advance();
  }
  addCompileList("expression", "close");
};

// expressionList
export const compileExpressionList = () => {
  addCompileList("expressionList", "open");
  advance();
  while (!isEndParenthesis()) {
    if (isCommaSymbol()) {
      addCompileList(getTokenKey()); //,
      advance();
    }
    compileExpression(isEndParenthesis);
  }
  addCompileList("expressionList", "close");
};

export const compileIdentifierOnTerm = () => {
  if (hasDotLookAhead()) {
    advance();
    addCompileList(getTokenKey()); //.
    advance();
    addCompileList(getTokenKey()); // new
    advance();
    addCompileList(getTokenKey()); // (
    compileExpressionList();
    addCompileList(getTokenKey()); // )
  }
  if (hasStartBracketAhead()) {
    advance();
    addCompileList(getTokenKey()); // [
    advance();
    compileExpression(isEndBracket);
    addCompileList(getTokenKey()); // ]
  }
};

// term
export const compileTerm = () => {
  addCompileList("term", "open");
  addCompileList(getTokenKey());
  if (hasIdentifierKey()) compileIdentifierOnTerm();
  if (isStartParenthesis()) {
    // (
    advance();
    compileExpression(isEndParenthesis);
    addCompileList(getTokenKey()); // )
  }
  addCompileList("term", "close");
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
  console.log(CompileManager.getCompileList());
  return CompileManager.getCompileList().join("\n");
};
