import { UserRecorderTracker } from "../../src/tracker/user-recorder"

describe("UserRecorderTracker", () => {
  describe("getTracker", () => {
    afterEach(() => {
      global.userRecorder = undefined
    })

    it("should return object if the user recorder object is available", () => {
      global.userRecorder = { method: {} }
      expect(UserRecorderTracker.getTracker()).toEqual(
        expect.objectContaining({
          method: {}
        })
      )
    })

    it("should return a proxy if user recorder object is not available", () => {
      delete global.userRecorder
      const fuc = UserRecorderTracker.getTracker()
      // if the returned object is a proxy it will not throw error on calling
      // some undefined function
      expect(fuc).not.toThrow()
    })
  })

  describe("tracking method", () => {
    const userRecorderTracker = new UserRecorderTracker()
    const getTrackerMock = jest.fn()
    const userRecorderTrackerMock = {
      identify: jest.fn(),
      clearSession: jest.fn()
    }
    getTrackerMock.mockReturnValue(userRecorderTrackerMock)

    beforeAll(() => {
      UserRecorderTracker.getTracker = getTrackerMock
    })

    afterAll(() => {
      UserRecorderTracker.getTracker.mockRestore()
    })

    afterEach(() => {
      userRecorderTrackerMock.identify.mockReset()
      userRecorderTrackerMock.clearSession.mockReset()
    })

    describe("identifyUser", () => {
      it("should call hj identify with the correct parameter", () => {
        const userProfile = {
          email: "my-email",
          _id: "the-id",
          firstName: "John",
          lastName: "Doe"
        }
        userRecorderTracker.identifyUser(userProfile)
        expect(userRecorderTrackerMock.identify).toBeCalledWith(userProfile)
      })
    })

    describe("logout", () => {
      it("should be able to trigger logout method on session recording script", () => {
        userRecorderTracker.logout()
        expect(userRecorderTrackerMock.clearSession).toBeCalled()
      })
    })
  })
})
