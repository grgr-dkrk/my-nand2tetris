// TODO
export const StackManager = (() => {
  let index = 0
  return {
    addIndex() {
      index++
    },
    getIndex() {
      return index
    }
  }
})()