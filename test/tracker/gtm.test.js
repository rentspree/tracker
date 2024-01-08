import { GTMTracker } from "../../src/tracker/gtm"

describe("GTMTracker", () => {
  const trackingId = 'foobar'

  describe("constructor", () => {
    it("should hold trackingId from option", () => {
      const gtmTracker = new GTMTracker({ trackingId })
      expect(gtmTracker.trackingId).toEqual(trackingId)
    })
  })

  describe("getTracker", () => {
    afterEach(() => {
      global.dataLayer = undefined
    })

    it("should return dataLayer object if it exists", () => {
      global.dataLayer = { foo: 'bar' }
      expect(GTMTracker.getTracker()).toEqual(
        expect.objectContaining({
          foo: 'bar'
        })
      )
    })
    it("should return a proxy if dataLayer is not available", () => {
      delete global.dataLayer
      const proxy = GTMTracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(proxy.someFunction).not.toThrow()
    })
  })

  describe("tracking function", () => {
    const gtmTracker = new GTMTracker({
      trackingId,
      mapUserProfile: profile => ({
        id: profile.userId,
      })
    })
    const userId = 1
    
    const mockGetTracker = jest.fn()
    const mockDataLayerPush = jest.fn()
    mockGetTracker.mockReturnValue({
      push: mockDataLayerPush
    })

    beforeAll(() => {
      GTMTracker.getTracker = mockGetTracker
    })
    
    afterEach(() => {
      mockDataLayerPush.mockReset()
    })

    afterAll(() => {
      GTMTracker.getTracker.mockRestore()
    })

    describe("identifyUser", () => {
      it("should set the userId attribute", () => {
        gtmTracker.identifyUser({
          userId
        })
        expect(gtmTracker.userId).toEqual(userId)
      })
    })

    describe("trackEvent", () => {
      it("should call trackEvent with userId", () => {
        const eventName = "test"
        const eventProperty = { foo: "bar" }
        gtmTracker.trackEvent(eventName, eventProperty)
        expect(mockDataLayerPush).toBeCalledWith({
          userId,
          event: eventName,
          properties: {
            ...eventProperty
          }
        })
      })
    })
  })
})
