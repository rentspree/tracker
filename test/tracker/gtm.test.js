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

  describe("getSpecificTracker", () => {
    const gtmTracker = new GTMTracker({
      trackingId
    })

    afterEach(() => {
      global['google_tag_manager'] = undefined
    })

    it("should return dataLayer object if it exists", () => {
      global['google_tag_manager'] = {
        [trackingId]: {
          dataLayer: {
            foo: 'bar'
          }
        }
      }
      expect(gtmTracker.getSpecificDataLayer()).toEqual(
        expect.objectContaining({
          foo: 'bar'
        })
      )
    })
    it("should return a undefined if dataLayer is not available", () => {
      delete global['google_tag_manager']
      expect(gtmTracker.getSpecificDataLayer()).toEqual(undefined)
    })
  })

  describe("tracking function", () => {
    const gtmTracker = new GTMTracker({
      trackingId,
      mapUserProfile: profile => ({
        userId: profile.userId,
      })
    })
    const userId = 1
    const mockDataLayerSet = jest.fn()
    const mockDataLayerGet = jest.fn()
    
    const mockGetTracker = jest.fn()
    const mockDataLayerPush = jest.fn()
    mockGetTracker.mockReturnValue({
      push: mockDataLayerPush
    })

    beforeAll(() => {
      GTMTracker.getTracker = mockGetTracker
      global['google_tag_manager'] = {
        [trackingId]: {
          dataLayer: {
            set: mockDataLayerSet,
            get: mockDataLayerGet
          }
        }
      }
    })
    
    afterEach(() => {
      mockDataLayerSet.mockReset()
      mockDataLayerGet.mockReset()
      mockDataLayerPush.mockReset()
    })

    afterAll(() => {
      GTMTracker.getTracker.mockRestore()
    })

    describe("identifyUser", () => {
      it("should call dataLayer.set", () => {
        gtmTracker.identifyUser({
          userId
        })
        expect(mockDataLayerSet).toBeCalledWith('userId', userId)
      })
    })

    describe("getUserIdFromDataLayer", () => {
      it("should call dataLayer.get", () => {
        gtmTracker.getUserIdFromDataLayer()
        expect(mockDataLayerGet).toBeCalledWith('userId')
      })
    })

    describe("trackEvent", () => {
      it("should call trackEvent with userId", () => {
        identifyUserSpy = jest.spyOn(gtmTracker, "getUserIdFromDataLayer").mockReturnValue(userId)
        const eventName = "test"
        const eventProperty = { foo: "bar" }
        gtmTracker.trackEvent(eventName, eventProperty)
        expect(mockDataLayerPush).toBeCalledWith({
          event: eventName,
          properties: {
            userId,
            ...eventProperty
          }
        })
      })
    })
  })
})
