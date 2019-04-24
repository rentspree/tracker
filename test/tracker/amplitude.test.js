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
    const setIdentityMock = jest.fn()
    let setValue = {}
    const mockSetOnce = jest.fn((key, value) => {
      setValue[key] = value
    })
    const mockSet = jest.fn((key, value) => {
      setValue[key] = value
    })
    const mockAmplitudeSDK = {
      getInstance: () => ({
        init: jest.fn(),
        identify: setIdentityMock,
        setUserId: setUserIdMock
      }),
      Identify: () => ({
        setValue,
        setOnce: mockSetOnce,
        set: mockSet
      })
    }
    const amplitudeTracker = new AmplitudeTracker({
      apiKey,
      amplitudeSDK: mockAmplitudeSDK,
      mapUserIdentity: profile => profile.id,
      mapUserProfile: profile => ({
        id: {
          value: profile.id,
          setOnce: true
        }
      })
    })
    describe("identifyUser", () => {
      afterEach(() => {
        setValue = {}
        setUserIdMock.mockClear()
        setIdentityMock.mockClear()
        mockSetOnce.mockClear()
        mockSet.mockClear()
      })
      it("should call setUserId", () => {
        const profile = {
          id: "userId"
        }
        amplitudeTracker.identifyUser(profile)
        expect(setUserIdMock).toBeCalledWith(profile.id)
      })
      it("should call identify", () => {
        const profile = {
          id: "userId"
        }
        amplitudeTracker.identifyUser(profile)
        // eslint-disable-next-line
        const identifyObj = amplitudeTracker._setUserProperties({
          id: {
            value: profile.id,
            setOnce: true
          }
        })
        expect(setIdentityMock).toBeCalledWith(identifyObj)
      })
    })
    describe("_setUserProperties", () => {
      afterEach(() => {
        setValue = {}
        setUserIdMock.mockClear()
        setIdentityMock.mockClear()
        mockSetOnce.mockClear()
        mockSet.mockClear()
      })
      it("should call setOnce for setOnce is true", () => {
        const mappedProfile = {
          id: {
            value: "userId",
            setOnce: true
          }
        }
        // eslint-disable-next-line
        amplitudeTracker._setUserProperties(mappedProfile)
        expect(mockSet).not.toHaveBeenCalled()
        expect(mockSetOnce).toBeCalledWith("id", "userId")
      })
      it("should call set for setOnce is false", () => {
        const mappedProfile = {
          id: {
            value: "userId",
            setOnce: false
          }
        }
        // eslint-disable-next-line
        amplitudeTracker._setUserProperties(mappedProfile)
        expect(mockSetOnce).not.toHaveBeenCalled()
        expect(mockSet).toBeCalledWith("id", "userId")
      })
      it("should return correct obj", () => {
        const mappedProfile = {
          id: {
            value: "userId",
            setOnce: false
          },
          firstName: {
            value: "John",
            setOnce: false
          },
          lastName: {
            value: "Snow",
            setOnce: false
          }
        }
        // eslint-disable-next-line
        const result = amplitudeTracker._setUserProperties(mappedProfile)
        expect(result.setValue).toEqual({
          id: "userId",
          firstName: "John",
          lastName: "Snow"
        })
      })
    })
  })
})
