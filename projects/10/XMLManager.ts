export const XMLManager = (() => {
  let compileList: string[] = [];
  return {
    addXMLList(str: string) {
      compileList.push(str)
    },
    getXMLList() {
      return compileList
    },
    resetXMLList() {
      compileList = []
    }
  };
})();