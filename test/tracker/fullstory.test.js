import { FullStoryTracker } from "../../src/tracker/fullstory"

describe("FullStory", () => {
  describe("getTracker", () => {
    afterEach(() => {
      global.FA = undefined
    })
    it("should return gtag object if it has one", () => {
      global.FA = { key1: true }
      expect(FullStoryTracker.getTracker()).toEqual(
        expect.objectContaining({
          key1: true
        })
      )
    })
    it("should return a proxy if gtag is not available", () => {
      delete global.FA
      const proxy = FullStoryTracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(proxy.someFunction).not.toThrow()
    })
  })
  describe("tracking method", () => {
    const fullStoryTracker = new FullStoryTracker({
      mapUserIdentity: profile => profile._id, // eslint-disable-line no-underscore-dangle
      mapUserProfile: profile => ({
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`
      })
    })
    const getTrackerMock = jest.fn()
    const faTrackerMock = {
      identify: jest.fn()
    }
    getTrackerMock.mockReturnValue(faTrackerMock)
    beforeAll(() => {
      FullStoryTracker.getTracker = getTrackerMock
    })
    afterAll(() => {
      FullStoryTracker.getTracker.mockRestore()
    })
    afterEach(() => {
      faTrackerMock.identify.mockReset()
    })
    describe("identifyUser", () => {
      it("should call FA.identify with the correct parameter", () => {
        fullStoryTracker.identifyUser({
          email: "my-email",
          _id: "the-id",
          firstName: "John",
          lastName: "Doe"
        })
        expect(faTrackerMock.identify).toBeCalledWith("the-id", {
          email: "my-email",
          name: "John Doe"
        })
      })
    })
  })
})
