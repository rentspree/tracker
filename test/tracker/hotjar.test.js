import { HotjarTracker } from "../../src/tracker/hotjar"

describe("FullStory", () => {
  describe("getTracker", () => {
    afterEach(() => {
      global.hj = undefined
    })
    it("should return object if it has one", () => {
      global.hj = { key1: true }
      expect(HotjarTracker.getTracker()).toEqual(
        expect.objectContaining({
          key1: true
        })
      )
    })
    it("should return a proxy if gtag is not available", () => {
      delete global.FA
      const fuc = HotjarTracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(fuc).not.toThrow()
    })
  })
  describe("tracking method", () => {
    const hotjarTracker = new HotjarTracker({
      mapUserIdentity: profile => profile._id, // eslint-disable-line no-underscore-dangle
      mapUserProfile: profile => ({
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`
      })
    })
    const getTrackerMock = jest.fn()
    const hjTrackerMock = jest.fn()
    getTrackerMock.mockReturnValue(hjTrackerMock)
    beforeAll(() => {
      HotjarTracker.getTracker = getTrackerMock
    })
    afterAll(() => {
      HotjarTracker.getTracker.mockRestore()
    })
    afterEach(() => {
      hjTrackerMock.mockReset()
    })
    describe("identifyUser", () => {
      it("should call hj identify with the correct parameter", () => {
        hotjarTracker.identifyUser({
          email: "my-email",
          _id: "the-id",
          firstName: "John",
          lastName: "Doe"
        })
        expect(hjTrackerMock).toBeCalledWith("identify", "the-id", {
          email: "my-email",
          name: "John Doe"
        })
      })
    })
  })
})
