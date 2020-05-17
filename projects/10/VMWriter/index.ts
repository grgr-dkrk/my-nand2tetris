export enum Segment {
  Const = "constant",
  Arg = "argument",
  Local = "local",
  Static = "static",
  This = "this",
  That = "that",
  Pointer = "pointer",
  Temp = "temp",
}

export enum Command {
  Add = "add",
  Sub = "sub",
  Neg = "neg",
  Eq = "eq",
  Gt = "gt",
  Lt = "lt",
  And = "and",
  Or = "or",
  Not = "not",
}

export const OS_MATH = {
  MULTIPLY: "Math.multiply",
  DIVIDE: "Math.divide",
} as const;

export const OS_MEMORY = {
  ALLOC: "Memory.alloc",
} as const;

type Indexes = {
  while: number;
  if: number;
  args: number;
};

const initialIndexes: Indexes = {
  while: 0,
  if: 0,
  args: 0,
};

export const VMWriter = (() => {
  let list: string[] = [];
  let indexes: Indexes = { ...initialIndexes };
  return {
    writePush(segment: Segment, index: number) {
      list.push(`push ${segment} ${index}`);
    },
    writePop(segment: Segment, index: number) {
      list.push(`pop ${segment} ${index}`);
    },
    writeArithmetic(command: Command) {
      list.push(`${command}`);
    },
    writeLabel(label: string) {
      list.push(`label ${label}`);
    },
    writeGoto(label: string) {
      list.push(`goto ${label}`);
    },
    writeIf(label: string) {
      list.push(`if-goto ${label}`);
    },
    writeCall(name: string, nArgs: number) {
      list.push(`call ${name} ${nArgs}`);
    },
    writeFunction(name: string, nLocals: number) {
      list.push(`function ${name} ${nLocals}`);
    },
    writeReturn() {
      list.push(`return`);
    },
    addArgIndex() {
      indexes.args++;
    },
    getArgIndex() {
      return indexes.args;
    },
    resetArgIndex() {
      indexes.args = 0;
    },
    addWhileIndex() {
      indexes.while++;
    },
    getWhileIndex() {
      return indexes.while;
    },
    addIfIndex() {
      indexes.if++;
    },
    getIfIndex() {
      return indexes.if;
    },
    getList() {
      return list;
    },
    reset() {
      list = [];
      indexes = initialIndexes;
    },
  };
})();
