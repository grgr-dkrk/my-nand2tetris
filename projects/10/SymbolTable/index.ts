export enum SymbolKind {
  Static = "static",
  Field = "field",
  Argument = "argument",
  Var = "var",
}

export type Name = string;
export type Type = string;

export type Table<T> = {
  type: string;
  kind: T;
  index: number;
};

export const SymbolTable = (() => {
  let count: Record<SymbolKind, number> = {
    [SymbolKind.Static]: 0,
    [SymbolKind.Field]: 0,
    [SymbolKind.Argument]: 0,
    [SymbolKind.Var]: 0,
  };
  let classScope: Record<
    Name,
    Table<SymbolKind.Static | SymbolKind.Field>
  > = {};
  let subroutineScope: Record<
    Name,
    Table<SymbolKind.Argument | SymbolKind.Var>
  > = {};
  return {
    startSubroutine() {
      subroutineScope = {};
    },
    define(name: Name, type: Type, kind: SymbolKind) {
      console.log(`define: ${name}, ${type}, ${kind}`);
      switch (kind) {
        case SymbolKind.Static:
          classScope[name] = { type, kind, index: count.static };
          count.static++;
          break;
        case SymbolKind.Field:
          classScope[name] = { type, kind, index: count.field };
          count.field++;
          break;
        case SymbolKind.Argument:
          subroutineScope[name] = { type, kind, index: count.argument };
          count.argument++;
          break;
        case SymbolKind.Var:
          subroutineScope[name] = { type, kind, index: count.var };
          count.var++;
          break;
      }
    },
    varCount(kind: SymbolKind) {
      switch (kind) {
        case SymbolKind.Static:
        case SymbolKind.Field:
          return Object.values(classScope).filter((val) => val.kind === kind)
            .length;
        case SymbolKind.Argument:
        case SymbolKind.Var:
          return Object.values(subroutineScope).filter(
            (val) => val.kind === kind
          ).length;
      }
    },
    kindOf(name: string) {
      if (classScope[name]) return classScope[name].kind;
      if (subroutineScope[name]) return subroutineScope[name].kind;
      return null;
    },
    typeOf(name: string) {
      if (classScope[name]) return classScope[name].type;
      if (subroutineScope[name]) return subroutineScope[name].type;
      return null;
    },
    indexOf(name: string) {
      if (classScope[name]) return classScope[name].index;
      if (subroutineScope[name]) return subroutineScope[name].index;
      return null;
    },
    getClassScope() {
      return classScope;
    },
    getSubroutineScope() {
      return subroutineScope;
    },
    reset() {
      classScope = {};
      subroutineScope = {};
      count = {
        [SymbolKind.Static]: 0,
        [SymbolKind.Field]: 0,
        [SymbolKind.Argument]: 0,
        [SymbolKind.Var]: 0,
      };
    },
  };
})();
