import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem
} from "../../src/utils/window"

describe("Local Storage", () => {
  const key = "key"
  const value = "value"
  describe("#setLocalStorageItem", () => {
    it("should be to able to set local storage item", () => {
      setLocalStorageItem(key, value)
      expect(window.localStorage.getItem(key)).toEqual(value)
    })
  })
  describe("#getLocalStorageItem", () => {
    it("should be to able to get local storage item", () => {
      expect(getLocalStorageItem(key)).toEqual(value)
    })
  })
  describe("#removeLocalStorageItem", () => {
    it("should be to able to remove local storage item", () => {
      removeLocalStorageItem(key)
      expect(getLocalStorageItem(key)).toEqual(null)
    })
  })
})
