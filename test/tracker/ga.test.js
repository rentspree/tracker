import { GATracker } from "../../src/tracker/ga"

describe("GATracker", () => {
  describe("constructor", () => {
    it("should hold trackingId from option", () => {
      const gaTracker = new GATracker({ trackingId: "hello" })
      expect(gaTracker.trackingId).toEqual("hello")
    })
  })
  describe("getTracker", () => {
    afterEach(() => {
      global.gtag = undefined
    })
    it("should return gtag object if it has one", () => {
      global.gtag = { key1: true }
      expect(GATracker.getTracker()).toEqual(
        expect.objectContaining({
          key1: true
        })
      )
    })
    it("should return a proxy if gtag is not available", () => {
      delete global.gtag
      const proxy = GATracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(proxy.someFunction).not.toThrow()
    })
  })
  describe("tracking function", () => {
    const getTrackerMock = jest.fn()
    const gtagFunction = jest.fn()
    getTrackerMock.mockReturnValue(gtagFunction)
    beforeAll(() => {
      GATracker.getTracker = getTrackerMock
    })
    afterAll(() => {
      GATracker.getTracker.mockRestore()
    })
    afterEach(() => {
      gtagFunction.mockReset()
    })
    const trackingID = "the-trackingId"
    const gaTracker = new GATracker({
      trackingId: trackingID,
      mapUserProfile: profile => ({
        user_id: profile.email,
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`
      })
    })
    describe("trackPageView", () => {
      it("should call tracker function", () => {
        gaTracker.trackPageView("/some-url", "/some-path", {
          ipAddress: "ip-address"
        })
        expect(gtagFunction).toBeCalledWith("config", trackingID, {
          page_location: "/some-url",
          page_path: "/some-path",
          ipAddress: "ip-address"
        })
      })
    })
    describe("trackEvent", () => {
      it("should call tracker function", () => {
        gaTracker.trackEvent("event-name", { hello: true })
        expect(gtagFunction).toBeCalledWith("event", "event-name", {
          hello: true
        })
      })
      it("should call tracker function with empty object if null is supply", () => {
        gaTracker.trackEvent("event-name")
        expect(gtagFunction).toBeCalledWith("event", "event-name", {})
      })
    })
    describe("identifyUser", () => {
      it("should call tracker config", () => {
        gaTracker.identifyUser({
          email: "my-mail",
          firstName: "John",
          lastName: "Doe"
        })
        expect(gtagFunction).toBeCalledWith("set", {
          email: "my-mail",
          user_id: "my-mail",
          name: "John Doe"
        })
        expect(gtagFunction).toBeCalledWith("event", "Get Profile", {
          event_category: "Technical"
        })
      })
    })
  })
})
