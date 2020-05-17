export const CompileManager = (() => {
  let compileXMLList: string[] = [];
  let compileList: string[] = [];
  return {
    addCompileXMLList(str: string) {
      compileXMLList.push(str)
    },
    getCompileXMLList() {
      return compileXMLList
    },
    resetCompileXMLList() {
      compileXMLList = []
    },
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