import _ from "lodash"

/**
 * This should be the base tracker class
 */
export class BaseTracker {
  constructor(options) {
    const o = _.merge(
      {
        mapUserIdentity: p => p,
        mapUserProfile: p => p
      },
      options
    )
    this.mapUserIdentity = o.mapUserIdentity
    this.mapUserProfile = o.mapUserProfile
  }
  trackPageView() {}
  identifyUser() {}
  trackEvent() {}
}
