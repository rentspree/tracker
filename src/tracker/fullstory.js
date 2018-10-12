import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:fullstory")

/**
 * The class for FullStory tracker
 */
export class FullStoryTracker extends BaseTracker {
  /**
   * Static method for getting the tracker from window
   * @returns {Object | Proxy} the FA object, if the function is not existed in `window.FA`,
   * this method will return Proxy to avoid error
   * @static
   */
  static getTracker() {
    if (window.FS) {
      return window.FS
    }
    debug("warning! Seems like window.FS is not defined")
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  /**
   * send the identity of this user to FullStory
   * - the identity of the user is the return from `options.mapUserIdentity(profile)`
   * - the user detail is the return from `options.mapUserProfile(profile)`
   * The method simply call `FA.identity(options.mapUserIdentity(profile), options.mapUserProfile(profile))`
   * @param {Object} profile the user object
   */
  identifyUser(profile) {
    // For UserID Tracking view
    debug("identify user of", profile)
    const identity = this.mapUserIdentity(profile)
    const fsProfile = this.mapUserProfile(profile)
    debug("FS.identify(%s, %o)", identity, fsProfile)
    FullStoryTracker.getTracker().identify(identity, fsProfile)
  }
}
