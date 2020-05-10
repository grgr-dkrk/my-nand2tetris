import { escapeJackString } from "./util";

export const TokenManager = (() => {
  let index = 0;
  let tokenList: string[] = [];
  const tokenMap = new Map<string, string>();
  return {
    setTokenList(newTokenList: string[]) {
      tokenList = newTokenList;
    },
    setTokenMap(key: string, value: string) {
      tokenMap.set(key, escapeJackString(value));
    },
    getTokenMap() {
      return tokenMap;
    },
    getIndex() {
      return index;
    },
    getToken(index?: number) {
      return index ? tokenList[index] : tokenList[this.getIndex()];
    },
    addIndex() {
      index++;
    },
  };
})();