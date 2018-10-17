import { MixpanelTracker } from "../../src/tracker/mixpanel"

describe("Mixpanel", () => {
  describe("static method", () => {
    describe("checkReady", () => {
      afterEach(() => {
        global.mixpanel = undefined
      })
      it("should return true if mixpanel.__loaded is existed", () => {
        global.mixpanel = {
          __loaded: true
        }
        expect(MixpanelTracker.checkReady()).toBeTruthy()
      })
      it("should return false if mixpanel is undefined", () => {
        delete global.mixpanel
        expect(MixpanelTracker.checkReady()).toBeFalsy()
      })
      it("should return false if mixpanel.__loaded is not existed", () => {
        global.mixpanel = {}
        expect(MixpanelTracker.checkReady()).toBeFalsy()
      })
    })
    describe("getTracker", () => {
      afterEach(() => {
        global.mixpanel = undefined
      })
      it("should return mixpanel object if it has one", () => {
        global.mixpanel = { key1: true }
        expect(MixpanelTracker.getTracker()).toEqual(
          expect.objectContaining({
            key1: true
          })
        )
      })
      it("should return a proxy if mixpanel is not available", () => {
        delete global.mixpanel
        const proxy = MixpanelTracker.getTracker()
        // if the returned object is a proxy it will not throw error on calling
        // some undefined function
        expect(proxy.someFunction).not.toThrow()
      })
    })
  })
  describe("instnace method", () => {
    beforeAll(() => {
      jest.useFakeTimers()
      MixpanelTracker.checkReady = jest.fn()
      MixpanelTracker.getTracker = jest.fn()
    })
    afterEach(() => {
      MixpanelTracker.checkReady.mockReset()
      MixpanelTracker.getTracker.mockReset()
    })
    describe("callIfReady", () => {
      const thisObject = {
        someFn: jest.fn(),
        callIfReady: jest.fn()
      }
      const testFunction = MixpanelTracker.prototype.callIfReady.bind(
        thisObject
      )
      afterEach(() => {
        thisObject.someFn.mockReset()
        thisObject.callIfReady.mockReset()
      })
      it("should call the input function when checkReady return true", () => {
        MixpanelTracker.checkReady.mockReturnValueOnce(true)
        testFunction("someFn", 0, "hello")
        expect(thisObject.someFn).toBeCalledWith("hello")
      })
      it("should call itself if checkReady return false", () => {
        MixpanelTracker.checkReady.mockReturnValueOnce(false)
        testFunction("someFn", 0, "hello")
        jest.runAllTimers()
        expect(thisObject.callIfReady).toBeCalledWith("someFn", 1, "hello")
      })
      it("should return if recursive is more than 5", () => {
        testFunction("someFn", 6, "yesyes")
        expect(thisObject.someFn).not.toBeCalled()
        expect(thisObject.callIfReady).not.toBeCalled()
      })
      it("should call the input function when recursive is not supplied", () => {
        MixpanelTracker.checkReady.mockReturnValueOnce(true)
        testFunction("someFn")
        expect(thisObject.someFn).toBeCalled()
      })
    })
    describe("trackPageView", () => {
      const mixpanelTracker = new MixpanelTracker()
      mixpanelTracker.callIfReady = jest.fn()
      it("should call mixpanel.track", () => {
        const trackMockFn = jest.fn()
        MixpanelTracker.getTracker.mockReturnValue({ track: trackMockFn })
        mixpanelTracker._trackPageView("/some-url", "hello-path") //eslint-disable-line
        expect(trackMockFn).toBeCalledWith("page viewed", {
          url: "/some-url",
          path: "hello-path"
        })
      })
      it("should call mixpanel.track with additional properties", () => {
        const trackMockFn = jest.fn()
        MixpanelTracker.getTracker.mockReturnValue({ track: trackMockFn })
        mixpanelTracker._trackPageView("/some-url", "hello-path", { //eslint-disable-line
          pageName: "Hello World Page",
          pageGroup: "Occupation Page"
        })
        expect(trackMockFn).toBeCalledWith("page viewed", {
          url: "/some-url",
          path: "hello-path",
          pageName: "Hello World Page",
          pageGroup: "Occupation Page"
        })
      })
      it("should call callIfReady with the fnName", () => {
        mixpanelTracker.trackPageView("/some-url", "hello-path")
        expect(mixpanelTracker.callIfReady).toBeCalledWith(
          "_trackPageView",
          0,
          "/some-url",
          "hello-path"
        )
      })
    })
    describe("trackEvent", () => {
      const mixpanelTracker = new MixpanelTracker()
      mixpanelTracker.callIfReady = jest.fn()
      it("should call mixpanel.track", () => {
        const trackMockFn = jest.fn()
        MixpanelTracker.getTracker.mockReturnValue({ track: trackMockFn })
        mixpanelTracker._trackEvent("someEvent", {}) //eslint-disable-line
        expect(trackMockFn).toBeCalledWith("someEvent", {})
      })
      it("should call mixpanel.track with empty object if properties is not suppied", () => {
        const trackMockFn = jest.fn()
        MixpanelTracker.getTracker.mockReturnValue({ track: trackMockFn })
        mixpanelTracker._trackEvent("someEvent") //eslint-disable-line
        expect(trackMockFn).toBeCalledWith("someEvent", {})
      })
      it("should call callIfReady with the fnName", () => {
        mixpanelTracker.trackEvent("someEvent", {})
        expect(mixpanelTracker.callIfReady).toBeCalledWith(
          "_trackEvent",
          0,
          "someEvent",
          {}
        )
      })
      it("should call with empty object if properties is empty", () => {
        mixpanelTracker.trackEvent("someEvent")
        expect(mixpanelTracker.callIfReady).toBeCalledWith(
          "_trackEvent",
          0,
          "someEvent",
          {}
        )
      })
    })
    describe("identifyUser", () => {
      const mockFn = {
        identify: jest.fn(),
        people: {
          set: jest.fn()
        }
      }
      it("should be able to define mapUserIdentity", () => {
        const mixPanelTracker = new MixpanelTracker({
          mapUserIdentity: p => p.name
        })
        expect(mixPanelTracker.mapUserIdentity({ name: "1234" })).toEqual(
          "1234"
        )
      })
      it("should be able to define mapUserProfile", () => {
        const mixPanelTracker = new MixpanelTracker({
          mapUserProfile: () => ({})
        })
        expect(mixPanelTracker.mapUserProfile({ name: "1234" })).toEqual({})
      })
      it("should call identify with data from mapUserIdentity", () => {
        const mixPanelTracker = new MixpanelTracker({
          mapUserIdentity: () => "hello"
        })
        MixpanelTracker.getTracker.mockReturnValue(mockFn)
        mixPanelTracker.identifyUser()
        expect(mockFn.identify).toBeCalledWith("hello")
      })
      it("should call people.set with data from mapUserIdentity", () => {
        const mixPanelTracker = new MixpanelTracker({
          mapUserProfile: () => "profile"
        })
        MixpanelTracker.getTracker.mockReturnValue(mockFn)
        mixPanelTracker.identifyUser()
        expect(mockFn.people.set).toBeCalledWith("profile")
      })
    })
    describe("setAliasUser", () => {
      const mixpanelTracker = new MixpanelTracker()
      it("should call mixpanel.alias", () => {
        const aliasMockFn = jest.fn()
        MixpanelTracker.getTracker.mockReturnValue({ alias: aliasMockFn })
        mixpanelTracker.setAliasUser("alias@gmail.com") //eslint-disable-line
        expect(aliasMockFn).toBeCalledWith("alias@gmail.com")
      })
    })
  })
})
