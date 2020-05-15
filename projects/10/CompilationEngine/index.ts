import { TokenManager } from "../Tokenizer/TokenManager";
import { CompileManager } from "./CompileManager";
import {
  addCompileXMLList,
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
  isMethod,
} from "./utils";
import { SymbolKind, Type, Name, SymbolTable } from "../SymbolTable";
import { VMWriter, Segment, Command } from "../VMWriter";

export const compileClass = () => {
  addCompileXMLList("class", "open");
  addCompileXMLList("keyword");
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
    addCompileXMLList(getTokenKey());
  }
  addCompileXMLList("symbol");
  addCompileXMLList("class", "close");
};

// classVarDec
export const compileClassVarDec = () => {
  let kind: SymbolKind;
  let type: Type;
  let name: Name;
  addCompileXMLList("classVarDec", "open");

  // kind
  kind = getTokenValue() as SymbolKind; // static | field
  addCompileXMLList(getTokenKey()); // static | field
  advance();

  // type
  type = getTokenValue();
  addCompileXMLList(getTokenKey());
  advance();

  // name
  name = getTokenValue();
  addCompileXMLList(getTokenKey());
  advance();

  // define varDec
  SymbolTable.define(name, type, kind);

  while (true) {
    if (isSemicolonSymbol()) {
      addCompileXMLList(getTokenKey()); // ;
      break;
    }

    // comma
    addCompileXMLList(getTokenKey()); // ,
    advance();

    // add name
    name = getTokenValue();
    addCompileXMLList(getTokenKey());

    if (name === ";" || name === ",") throw new Error(`invalid name ${name}`);

    // define varDec additional
    SymbolTable.define(name, type, kind);
    advance();
  }
  addCompileXMLList("classVarDec", "close");
};

// varDec
export const compileVarDec = () => {
  let type: Type;
  let name: Name;
  addCompileXMLList("varDec", "open");

  // keyword
  addCompileXMLList(getTokenKey()); // var
  advance();

  // type
  type = getTokenValue();
  addCompileXMLList(getTokenKey()); // type
  advance();

  while (!isSemicolonSymbol()) {
    // , 区切りはSymbolTableに不要なので、XMLにだけ追加
    if (isCommaSymbol()) {
      addCompileXMLList(getTokenKey()); // ,
      advance();
      continue;
    }

    // identifier
    name = getTokenValue();
    SymbolTable.define(name, type, SymbolKind.Var);
    addCompileXMLList(getTokenKey()); // identifier
    advance();
  }

  addCompileXMLList(getTokenKey()); // ;
  addCompileXMLList("varDec", "close");
};

// subroutineBody
export const compileSubroutineBody = () => {
  addCompileXMLList("subroutineBody", "open");
  addCompileXMLList(getTokenKey()); // {
  while (!isEndBrace()) {
    advance();
    if (isVarDec()) {
      compileVarDec();
      continue;
    }
    compileStatements();
  }
  addCompileXMLList(getTokenKey()); // }
  addCompileXMLList("subroutineBody", "close");
};

// parameterList
export const compileParameterList = () => {
  let type: Type;
  let name: Name;

  // compileParameterList の終端記号はタグの外に置く
  addCompileXMLList(getTokenKey()); // (
  addCompileXMLList("parameterList", "open");
  advance();

  while (true) {
    if (isEndParenthesis()) {
      break;
    }
    if (isCommaSymbol()) {
      addCompileXMLList(getTokenKey()); // ,
      advance();
      continue;
    }

    // type
    type = getTokenValue();
    addCompileXMLList(getTokenKey()); // type
    advance();

    // name
    name = getTokenValue();
    if (name === "," || name === ")") {
      throw new Error(`invalid name: ${name}`);
    }
    SymbolTable.define(name, type, SymbolKind.Argument);
    addCompileXMLList(getTokenKey()); // name
    advance();
  }
  addCompileXMLList("parameterList", "close");
  addCompileXMLList(getTokenKey()); // )
};

// subRoutine
export const compileSubroutine = () => {
  addCompileXMLList("subroutineDec", "open");
  addCompileXMLList("keyword");

  // kind
  advance();
  addCompileXMLList(getTokenKey()); // constructor | function | method

  // define Method
  if (isMethod()) {
    SymbolTable.define(
      "self",
      TokenManager.getClassName(),
      SymbolKind.Argument
    );
  }

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
    addCompileXMLList(getTokenKey());
  }
  addCompileXMLList("subroutineDec", "close");
};

// statements
export const compileStatements = () => {
  addCompileXMLList("statements", "open");
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
  addCompileXMLList("statements", "close");
};

// let
export const compileLet = () => {
  let kind: SymbolKind | null;
  let name: Name;
  let index: number | null;
  addCompileXMLList("letStatement", "open");
  addCompileXMLList(getTokenKey()); // let

  // name, kind, inedx
  advance();
  name = getTokenValue();
  kind = SymbolTable.kindOf(name);
  index = SymbolTable.indexOf(name);
  addCompileXMLList(getTokenKey());

  while (!isSemicolonSymbol()) {
    advance();
    if (isStartBracket()) {
      addCompileXMLList(getTokenKey()); // [
      advance();
      compileExpression(isEndBracket);
      addCompileXMLList(getTokenKey()); // ]

      // vm
      if (kind == null) throw new Error(`kind is not found`);
      if (index == null) throw new Error(`index is not found`);
      VMWriter.writePush((kind as unknown) as Segment, index);
      VMWriter.writeArithmetic(Command.Add);
      VMWriter.writePop(Segment.Temp, 0);

      advance()
      addCompileXMLList(getTokenKey()); // =
      advance()
      compileExpression(isSemicolonSymbol);
      addCompileXMLList(getTokenKey()); // ;

      VMWriter.writePush(Segment.Temp, 0)
      VMWriter.writePop(Segment.Pointer, 1)
      VMWriter.writePop(Segment.That, 0)
      continue;
    }
    else {
      addCompileXMLList(getTokenKey()); // =
      advance();
      compileExpression(isSemicolonSymbol);
      addCompileXMLList(getTokenKey()); // ;

      // vm
      if (kind == null) throw new Error(`kind is not found`);
      if (index == null) throw new Error(`index is not found`);
      VMWriter.writePop((kind as unknown) as Segment, index)

      continue;
    }
  }
  addCompileXMLList("letStatement", "close");
};

// if
export const compileIf = () => {
  addCompileXMLList("ifStatement", "open");
  addCompileXMLList(getTokenKey()); // if
  advance();
  addCompileXMLList(getTokenKey()); // (
  advance();
  compileExpression(isEndParenthesis);
  addCompileXMLList(getTokenKey()); // )
  advance();
  addCompileXMLList(getTokenKey()); // {
  advance();
  compileStatements();
  addCompileXMLList(getTokenKey()); // }
  advance();
  if (getTokenValue() === "else") {
    addCompileXMLList(getTokenKey()); // else
    advance();
    addCompileXMLList(getTokenKey()); // {
    advance();
    compileStatements();
    addCompileXMLList(getTokenKey()); // }
    advance();
  }
  addCompileXMLList("ifStatement", "close");
};

// do
export const compileDo = () => {
  addCompileXMLList("doStatement", "open");
  addCompileXMLList(getTokenKey()); // do
  // subroutineCall
  while (!isSemicolonSymbol()) {
    advance();
    if (isStartParenthesis()) {
      addCompileXMLList(getTokenKey()); // (
      compileExpressionList();
      addCompileXMLList(getTokenKey()); // )
      continue;
    }
    addCompileXMLList(getTokenKey());
  }
  addCompileXMLList("doStatement", "close");
  VMWriter.writePop(Segment.Temp, 0);
  advance();
};

// while
export const compileWhile = () => {
  addCompileXMLList("whileStatement", "open");
  addCompileXMLList(getTokenKey()); // while
  advance();
  addCompileXMLList(getTokenKey()); // (
  advance();
  compileExpression(isEndParenthesis);
  addCompileXMLList(getTokenKey()); // )
  advance();
  addCompileXMLList(getTokenKey()); // {
  advance();
  compileStatements();
  addCompileXMLList(getTokenKey()); // }
  advance();
  addCompileXMLList("whileStatement", "close");
};

// return
export const compileReturn = () => {
  addCompileXMLList("returnStatement", "open");
  addCompileXMLList(getTokenKey()); // return
  advance();
  if (isSemicolonSymbol()) {
    addCompileXMLList(getTokenKey()); // ;
  } else {
    compileExpression(isSemicolonSymbol);
    addCompileXMLList(getTokenKey()); // ;
  }
  addCompileXMLList("returnStatement", "close");
  advance();
};

// expression
export const compileExpression = (endCondition: () => boolean) => {
  addCompileXMLList("expression", "open");
  if (hasUnaryOp()) {
    addCompileXMLList("term", "open");
    addCompileXMLList(getTokenKey()); // unaryOp
    advance();
    compileTerm();
    addCompileXMLList("term", "close");
    advance();
  }
  while (!endCondition()) {
    if (isOp()) {
      addCompileXMLList(getTokenKey()); // op
      advance();
    }
    if (isCommaSymbol()) {
      break;
    }
    compileTerm();
    advance();
  }
  addCompileXMLList("expression", "close");
};

// expressionList
export const compileExpressionList = () => {
  addCompileXMLList("expressionList", "open");
  advance();
  while (!isEndParenthesis()) {
    if (isCommaSymbol()) {
      addCompileXMLList(getTokenKey()); //,
      advance();
    }
    compileExpression(isEndParenthesis);
  }
  addCompileXMLList("expressionList", "close");
};

export const compileIdentifierOnTerm = () => {
  if (hasDotLookAhead()) {
    advance();
    addCompileXMLList(getTokenKey()); //.
    advance();
    addCompileXMLList(getTokenKey()); // new
    advance();
    addCompileXMLList(getTokenKey()); // (
    compileExpressionList();
    addCompileXMLList(getTokenKey()); // )
  }
  if (hasStartBracketAhead()) {
    advance();
    addCompileXMLList(getTokenKey()); // [
    advance();
    compileExpression(isEndBracket);
    addCompileXMLList(getTokenKey()); // ]
  }
};

// term
export const compileTerm = () => {
  addCompileXMLList("term", "open");
  addCompileXMLList(getTokenKey());
  if (hasIdentifierKey()) compileIdentifierOnTerm();
  if (isStartParenthesis()) {
    // (
    advance();
    compileExpression(isEndParenthesis);
    addCompileXMLList(getTokenKey()); // )
  }
  addCompileXMLList("term", "close");
};

export const iterateComplation = () => {
  if (getTokenKey() === "keyword" && getTokenValue() === "class") {
    compileClass();
  }
  advance();
};

export const Compilation = (className: string) => {
  TokenManager.setClassName(className);
  TokenManager.createTokenMapIterator();
  while (!TokenManager.getIsNextTokenMapDone()) {
    iterateComplation();
  }
  console.log(CompileManager.getCompileList());
  console.log(SymbolTable.getClassScope());
  console.log(SymbolTable.getSubroutineScope()); // TODO
  return CompileManager.getCompileXMLList().join("\n");
};
