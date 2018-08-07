import { BaseTracker } from "./base"
// GA tracker class to tracking the event via google analytics
export class FullStoryTracker extends BaseTracker {
  static getTracker() {
    if (window.FA) {
      return window.FA
    }
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  identifyUser(profile) {
    // For UserID Tracking view
    FullStoryTracker.getTracker().identify(
      this.mapUserIdentity(profile),
      this.mapUserProfile(profile)
    )
  }
}
