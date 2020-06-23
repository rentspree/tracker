import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:hotjar")

/**
 * The class for HotjarTracker tracker
 */
export class HotjarTracker extends BaseTracker {
  /**
   * Static method for getting the tracker from window
   * @returns {Object | Proxy} the FA object, if the function is not existed in `window.hj`,
   * this method will return Proxy to avoid error
   * @static
   */
  static getTracker() {
    if (window.hj) {
      return window.hj
    }
    debug("warning! Seems like window.hj is not defined")
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  /**
   * send the identity of this user to HotjarTracker
   * - the identity of the user is the return from `options.mapUserIdentity(profile)`
   * - the user detail is the return from `options.mapUserProfile(profile)`
   * @param {Object} profile the user object
   */
  identifyUser(profile) {
    // For UserID Tracking view
    debug("identify user of", profile)
    const identity = this.mapUserIdentity(profile)
    const attribute = this.mapUserProfile(profile)
    debug("hj(identify, %s, %o)", identity, attribute)
    HotjarTracker.getTracker()("identify", identity, attribute)
  }
}
