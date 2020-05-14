export const CompileManager = (() => {
  let compileList: string[] = [];
  return {
    addCompileList(str: string) {
      compileList.push(str)
    },
    getCompileList() {
      return compileList
    },
    resetCompileList() {
      compileList = []
    }
  };
})();