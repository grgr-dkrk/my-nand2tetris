import { escapeJackString } from "./utils";

export const TokenManager = (() => {
  let index = 0;
  let tokenList: string[] = [];
  let iter: [string, string][];
  let iterIndex = 0;
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
    resetTokenMap() {
      return tokenMap.clear();
    },
    createTokenMapIterator() {
      iter = [];
      tokenMap.forEach((value, key) => {
        iter.push([key, value]);
      });
      iterIndex = 0;
    },
    getLookAheadTokenMap() {
      return iter[iterIndex + 1];
    },
    getNextTokenMap() {
      return iter[iterIndex];
    },
    nextTokenMap() {
      iterIndex++;
    },
    getIsNextTokenMapDone() {
      return iterIndex >= iter.length - 1;
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
    resetIndex() {
      index = 0;
      iterIndex = 0;
    },
  };
})();
