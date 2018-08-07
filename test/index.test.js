import Tracker from "../src/index"
import { BaseTracker } from "../src/tracker/base"

describe("Tracker", () => {
  describe("registerTracker", () => {
    it("should be able to register tracker", () => {
      const base1 = new BaseTracker()
      const tracker = new Tracker()
      expect(tracker.trackers).toHaveLength(0)
      tracker.registerTracker(base1)
      expect(tracker.trackers).toHaveLength(1)
    })
  })
  describe("track event", () => {
    const base1 = new BaseTracker()
    jest.spyOn(base1, "trackPageView")
    jest.spyOn(base1, "identifyUser")
    jest.spyOn(base1, "trackEvent")
    const base2 = new BaseTracker()
    jest.spyOn(base2, "trackPageView")
    jest.spyOn(base2, "identifyUser")
    jest.spyOn(base2, "trackEvent")
    const tracker = new Tracker()
    tracker.trackers = [base1, base2]
    afterEach(() => {
      tracker.trackers.forEach(t => {
        ;["trackPageView", "identifyUser", "trackEvent"].forEach(method => {
          t[method].mockReset()
        })
      })
    })
    describe("trackPageView", () => {
      it("should call all the tracker", () => {
        tracker.trackPageView("/some-url", "path")
        tracker.trackers.forEach(t => {
          expect(t.trackPageView).toHaveBeenCalledWith("/some-url", "path")
        })
      })
    })
    describe("identifyUser", () => {
      it("should call all the tracker", () => {
        tracker.identifyUser({ email: "hello" })
        tracker.trackers.forEach(t => {
          expect(t.identifyUser).toHaveBeenCalledWith({ email: "hello" })
        })
      })
    })
    describe("trackEvent", () => {
      it("should call all the tracker", () => {
        tracker.trackEvent("event-name", {})
        tracker.trackers.forEach(t => {
          expect(t.trackEvent).toHaveBeenCalledWith("event-name", {})
        })
      })
    })
  })
})
