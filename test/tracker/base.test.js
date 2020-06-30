import { BaseTracker } from "../../src/tracker/base"

describe("BaseTracker", () => {
  const baseTracker = new BaseTracker()
  describe("dumb function", () => {
    it.each([
      "trackPageView",
      "identifyUser",
      "trackEvent",
      "setAliasUser",
      "logout"
    ])("%s", fnName => {
      expect(baseTracker[fnName]).not.toThrow()
    })
  })
})
