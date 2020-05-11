import { escapeJackString } from "./util";

export const TokenManager = (() => {
  let index = 0;
  let tokenList: string[] = [];
  let iter: IterableIterator<[string, string]>;
  let next: IteratorResult<[string, string], string>;
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
      iter = this.getTokenMap().entries();
      next = iter.next();
    },
    getNextTokenMap() {
      return next;
    },
    nextTokenMap() {
      next = iter.next();
    },
    getIsNextTokenMapDone() {
      return next.done;
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
    },
  };
})();
