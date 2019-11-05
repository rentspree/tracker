import { HubspotTracker } from "../../src/tracker/hubspot"

describe("HubspotTracker", () => {
  describe("getTracker", () => {
    afterEach(() => {
      global._hsq = undefined
    })
    it("should return hubspot sdk if it has one", () => {
      const mockHsq = {
        push: jest.fn()
      }
      global._hsq = mockHsq
      expect(HubspotTracker.getTracker()).toEqual(mockHsq)
    })
    it("should return a proxy if gtag is not available", () => {
      delete global._hsq
      const proxy = HubspotTracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(proxy.push).not.toThrow()
    })
  })
  describe("tracking function", () => {
    const getTrackerMock = jest.fn()
    const hsqFuncMock = jest.fn()
    getTrackerMock.mockReturnValue({
      push: hsqFuncMock
    })
    beforeAll(() => {
      HubspotTracker.getTracker = getTrackerMock
    })
    afterAll(() => {
      HubspotTracker.getTracker.mockRestore()
    })
    afterEach(() => {
      hsqFuncMock.mockReset()
    })
    const hubspotTracker = new HubspotTracker({
      mapUserIdentity: profile => ({
        email: profile.email,
        instantlyCreateContact: profile.instantlyCreate
      })
    })
    describe("identifyUser", () => {
      it("should call only identity when instantlyCreateContact is false", () => {
        hubspotTracker.identifyUser({
          email: "my-mail",
          instantlyCreate: false
        })
        expect(hsqFuncMock).toBeCalledWith([
          "identify",
          {
            email: "my-mail"
          }
        ])
        expect(hsqFuncMock).not.toBeCalledWith([
          "trackEvent",
          {
            id: "Identify User",
            value: "my-mail"
          }
        ])
      })
      it("should call only identity when instantlyCreateContact is false", () => {
        hubspotTracker.identifyUser({
          email: "my-mail",
          instantlyCreate: true
        })
        expect(hsqFuncMock).toBeCalledWith([
          "identify",
          {
            email: "my-mail"
          }
        ])
        expect(hsqFuncMock).toBeCalledWith([
          "trackEvent",
          {
            id: "Identify User",
            value: "my-mail"
          }
        ])
      })
    })
  })
})
