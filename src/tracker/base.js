import _ from "lodash"

/**
 * Base for all Tracker class
 */
export class BaseTracker {
  /**
   * Create a Tracker
   * @param {Object} options specify the tracker options
   * @param {(Object) => String} options.mapUserIdentity function to map user identity, it takes user `profile`
   * supply by the event caller and return the userIdentity
   * @param {(Object) => Object} options.mapUserProfile function to map user profile to send to the tracker
   */
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
  /**
   * Dummy function for tracking page view
   */
  trackPageView() {}

  /**
   * Dummy function for identify user
   */
  identifyUser() {}

  /**
   * Dummy function for track event
   */
  trackEvent() {}

  /**
   * Dummy function for set alias of user
   */
  setAliasUser() {}
}
