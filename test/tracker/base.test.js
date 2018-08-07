import { BaseTracker } from "../../src/tracker/base"

describe("BaseTracker", () => {
  const baseTracker = new BaseTracker()
  describe("dumb function", () => {
    it.each(["trackPageView", "identifyUser", "trackEvent"])("%s", fnName => {
      expect(baseTracker[fnName]).not.toThrow()
    })
  })
})
