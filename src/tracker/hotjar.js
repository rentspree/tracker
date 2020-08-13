import createDebug from "debug"
import { removeLocalItem } from "@rentspree/cookie"

import { BaseTracker } from "./base"
import { removeLocalStorageItem } from "../utils/window"

const debug = createDebug("rentspree-tracker:hotjar")

/**
 * The class for HotjarTracker tracker
 */
export class HotjarTracker extends BaseTracker {
  constructor(...args) {
    super(...args)
    this.hjSessionKeyName = "_hjid"
  }

  /**
   * Static method for getting the tracker from window
   * @returns {Object | Proxy} the hj object, if the function is not existed in `window.hj`,
   * this method will return Proxy to avoid error
   * @static
   */
  static getTracker() {
    if (window.hj) {
      return window.hj
    }
    debug("warning! Seems like window.hj is not defined")
    return () => {}
  }

  /**
   * send the identity of this user to HotjarTracker
   * - the identity of the user is the return from `options.mapUserIdentity(profile)`
   * - the user detail is the return from `options.mapUserProfile(profile)`
   * @param {Object} profile the user object
   */
  identifyUser(profile) {
    // For UserID Tracking view
    debug("=== Hotjar identifyUser running... ===")
    debug("user data %o => ", profile)
    const identity = this.mapUserIdentity(profile)
    const attribute = this.mapUserProfile(profile)
    debug("hj(identify, %s, %o)", identity, attribute)
    HotjarTracker.getTracker()("identify", identity, attribute)
    debug("=== Hotjar identifyUser finished... ===")
  }

  /**
   * This method is removing Hotjar session with Local Storage and Cookie
   * for getting a newer Hotjar session for recording correct a new user logged in
   */
  logout() {
    debug("=== Hotjar logout running... ===")
    debug("Remove local storage and cookie with: %s", this.hjSessionKeyName)
    removeLocalStorageItem(this.hjSessionKeyName)
    removeLocalItem(this.hjSessionKeyName)
    debug("=== Hotjar logout finished... ===")
  }
}
