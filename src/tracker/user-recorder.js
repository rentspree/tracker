import createDebug from "debug"

import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:user-recorder")

/**
 * This class for capturing user behavior and user reaction on the website
 */
export class UserRecorderTracker extends BaseTracker {
  /**
   * Static method for getting the tracker from window
   * @returns {Object | Proxy} the user-recorder object from the provider
   * if the function is not existed, this method will return Proxy to avoid error
   * @static
   */
  static getTracker() {
    if (window.userRecorder) {
      return window.userRecorder
    }
    debug("Warning! Seems like window.userRecorder is undefined")
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  /**
   * identity the user information to provider script for mapping user on user recording provider
   * @param {Object} profile the user data object
   */
  identifyUser(profile) {
    debug("=== UserRecorderTracker identifyUser is running... 💫 ===")
    debug("user data %o => ", profile)
    UserRecorderTracker.getTracker()("identify", profile)
    debug("=== UserRecorderTracker identifyUser finished ✅ ===")
  }

  /**
   * This method is removing session recording with Local Storage and Cookie
   * for getting a newer recording session for recording correct a new user logged in
   */
  logout() {
    debug("=== UserRecorderTracker logout is running... 💫  ===")
    UserRecorderTracker.getTracker()("clearSession")
    debug("=== UserRecorderTracker logout finished ✅ ===")
  }
}
