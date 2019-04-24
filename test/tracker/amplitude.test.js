import { AmplitudeTracker } from "../../src/tracker/amplitude"

describe("AmplitudeTracker", () => {
  describe("constructor", () => {
    it("should set apiKey from option", () => {
      const amplitudeTracker = new AmplitudeTracker({ apiKey: "hello" })
      expect(amplitudeTracker.apiKey).toEqual("hello")
    })
    it("should set amplitudeSDK from option", () => {
      const mockGetInstance = { getInstance: jest.fn() }
      const amplitudeTracker = new AmplitudeTracker({
        amplitudeSDK: mockGetInstance
      })
      expect(amplitudeTracker.amplitudeSDK).toEqual(mockGetInstance)
    })
    it("should init tracker if amplitudeSDK and apiKey is exist", () => {
      const initTracker = jest.fn()
      const mockAmplitudeSDK = {
        getInstance: () => ({
          init: initTracker
        })
      }
      const apiKey = "apiKey"
      // eslint-disable-next-line
      const tracker = new AmplitudeTracker({
        apiKey,
        amplitudeSDK: mockAmplitudeSDK
      })
      expect(initTracker).toBeCalledWith(apiKey)
    })
    it("should not init tracker if amplitudeSDK or apiKey is not exist", () => {
      const initTracker = jest.fn()
      const mockAmplitudeSDK = {
        getInstance: () => ({
          init: initTracker
        })
      }
      const apiKey = "apiKey"
      // eslint-disable-next-line
      const tracker = new AmplitudeTracker({
        amplitudeSDK: mockAmplitudeSDK
      })
      expect(initTracker).not.toBeCalledWith(apiKey)
    })
  })
  describe("getTracker", () => {
    it("should return amplitude instance if it has one", () => {
      const apiKey = "apiKey"
      const initTracker = jest.fn()
      const mockAmplitudeSDK = {
        getInstance: () => ({
          init: initTracker
        })
      }
      const amplitudeTracker = new AmplitudeTracker({
        apiKey,
        amplitudeSDK: mockAmplitudeSDK
      })
      expect(amplitudeTracker.getTracker()).toEqual(
        mockAmplitudeSDK.getInstance()
      )
    })
    it("should return a proxy if amplitude is not available", () => {
      const amplitudeTracker = new AmplitudeTracker({
        apiKey: "apiKey"
      })
      const proxy = amplitudeTracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(proxy.someFunction).not.toThrow()
    })
  })
  describe("tracking function", () => {
    const apiKey = "the-trackingId"
    const setUserIdMock = jest.fn()
    const mockAmplitudeSDK = {
      getInstance: () => ({
        init: jest.fn(),
        setUserId: setUserIdMock
      })
    }
    const amplitudeTracker = new AmplitudeTracker({
      apiKey,
      amplitudeSDK: mockAmplitudeSDK,
      mapUserIdentity: profile => profile.id
    })
    describe("identifyUser", () => {
      it("should call tracker config", () => {
        const profile = {
          id: "userId"
        }
        amplitudeTracker.identifyUser(profile)
        expect(setUserIdMock).toBeCalledWith(profile.id)
      })
    })
  })
})
