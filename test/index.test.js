import Tracker from "../src/index"
import { BaseTracker } from "../src/tracker/base"
import { AmplitudeTracker } from "../src/tracker/amplitude"
import { UserRecorderTracker } from "../src/tracker/user-recorder"
import { HubspotTracker } from "../src/tracker/hubspot"

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
    jest.spyOn(base1, "setAliasUser")
    jest.spyOn(base1, "logout")
    const base2 = new BaseTracker()
    jest.spyOn(base2, "trackPageView")
    jest.spyOn(base2, "identifyUser")
    jest.spyOn(base2, "trackEvent")
    jest.spyOn(base2, "setAliasUser")
    jest.spyOn(base2, "logout")
    const tracker = new Tracker()
    tracker.trackers = [base1, base2]
    afterEach(() => {
      tracker.trackers.forEach(t => {
        ;[
          "trackPageView",
          "identifyUser",
          "trackEvent",
          "setAliasUser",
          "logout"
        ].forEach(method => {
          t[method].mockReset()
        })
      })
    })
    describe("trackPageView", () => {
      it("should call all the tracker", () => {
        tracker.trackPageView("/some-url", "path")
        tracker.trackers.forEach(t => {
          expect(t.trackPageView).toHaveBeenCalledWith("/some-url", "path", {})
        })
      })
      it("should call all the tracker with additional properties", () => {
        tracker.trackPageView("/some-url", "path", {
          pageName: "Hello World Page",
          pageGroup: "Occupation Page"
        })
        tracker.trackers.forEach(t => {
          expect(t.trackPageView).toHaveBeenCalledWith("/some-url", "path", {
            pageName: "Hello World Page",
            pageGroup: "Occupation Page"
          })
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
    describe("setAliasUser", () => {
      it("should call all the tracker", () => {
        tracker.setAliasUser("alias@gmail.com")
        tracker.trackers.forEach(t => {
          expect(t.setAliasUser).toHaveBeenCalledWith("alias@gmail.com")
        })
      })
    })
    describe("logout", () => {
      it("should call all the tracker", () => {
        tracker.logout()
        tracker.trackers.forEach(t => {
          expect(t.logout).toHaveBeenCalled()
        })
      })
    })
  })

  describe("identifyAmplitude", () => {
    const userEmail = "tracker@rentspree.com"
    const apiKey = "the-trackingId"
    const logEventMock = jest.fn()
    const setUserIdMock = jest.fn()
    const setIdentityMock = jest.fn()
    const regenerateDeviceIdMock = jest.fn()
    const setValue = {}
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
        setUserId: setUserIdMock,
        logEvent: logEventMock,
        regenerateDeviceId: regenerateDeviceIdMock
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
    const userRecorderTracker = new UserRecorderTracker()
    const hubspotTracker = new HubspotTracker()

    const identifyUserAmplitude = jest.spyOn(amplitudeTracker, "identifyUser")
    jest.spyOn(userRecorderTracker, "identifyUser")
    jest.spyOn(hubspotTracker, "identifyUser")

    const tracker = new Tracker()

    afterEach(() => {
      tracker.trackers.forEach(t => {
        ;["identifyUser"].forEach(method => {
          t[method].mockReset()
        })
      })
    })

    it("should able to call identify user on the `Amplitude` by calling `identifyAmplitude` method", () => {
      tracker.trackers = [amplitudeTracker, userRecorderTracker, hubspotTracker]
      tracker.identifyAmplitude({ email: userEmail })
      expect(identifyUserAmplitude).toHaveBeenCalled()
    })

    it("should not call any analytics identify user method when the tracker don't have the amplitude class", () => {
      tracker.trackers = [userRecorderTracker, hubspotTracker]
      tracker.identifyAmplitude({ email: userEmail })
      tracker.trackers.forEach(t => {
        expect(t.identifyUser).not.toHaveBeenCalledWith({ email: userEmail })
      })
    })
  })
})
