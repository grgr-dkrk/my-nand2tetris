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

export const VMWriter = (() => {
  let list: string[] = [];
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
      list.push(`call ${name} ${nLocals}`);
    },
    writeReturn() {
      list.push(`return`)
    },
    getList() {
      return list
    },
    reset() {
      list = []
    }
  };
})();
