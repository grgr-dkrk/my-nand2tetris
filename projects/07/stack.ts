// TODO
export const StackManager = (() => {
  let index = 0
  let callId = 0
  let currentFunctionName = ''
  return {
    addIndex() {
      index++
    },
    getIndex() {
      return index
    },
    addCallId() {
      callId++
    },
    getCallId() {
      return callId
    },
    getCurrentFunctionName() {
      return currentFunctionName
    },
    setCurrentFunctionName(arg: string) {
      currentFunctionName = arg
    },
  }
})()