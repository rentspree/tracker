import createDebug from "debug"

import { AMPLITUDE_TRACKER } from "./constants/amplitude"

const debug = createDebug("rentspree-tracker:main")

/**
 * The tracker class, this class will be the one place to trigger any tracking event
 * It will manage Instance that connect to each analytic provider
 * and call to track all of those providers api when one event occur.
 */
export default class Tracker {
  constructor() {
    debug("Initialize Tracker class")
    this.trackers = []
  }
  /**
   * Register the tracker Instance to track.
   * Each tracker must be initialize before register to the tracker
   * @example
   * const tracker = new Tracker()
   * const gaTracker = new GATracker({trackerId: "hello-tracker"})
   * tracker.registerTracker(gaTracker)
   * // with this the gaTracker event handler will be fired everytime
   * // the tracker got an event
   * @param {BaseTracker} trackerInstance the tracker to be tracked
   */
  registerTracker(trackerInstance) {
    debug("pushing %o tracker to main tracker", trackerInstance)
    this.trackers.push(trackerInstance)
  }
  /**
   * pass track page view parameter to every registeredTracker
   * @param {String} url the url to track
   * @param {String} path the path to track
   * @param {Object} properties the additional properties object to be passed to trackers
   */
  trackPageView(url, path, properties = {}) {
    const obj = {
      url,
      path,
      properties
    }
    debug("track page view for object %0", obj)
    this.trackers.forEach(
      t => t.trackPageView && t.trackPageView(url, path, properties)
    )
  }
  /**
   * pass identify user parameter to every registered tracker
   * @param {Object} profile the profile object that will be passed through `mapUserIdentity` and `mapUserProfile` for each tracker instance.
   */
  identifyUser(profile) {
    debug("identify user %O", profile)
    this.trackers.forEach(t => t.identifyUser && t.identifyUser(profile))
  }
  /**
   * pass identify user on the amplitude only
   * @param {Object} profile the profile object that will be passed through `mapUserIdentity` and `mapUserProfile` for only amplitude tracker instance.
   */
  identifyAmplitude(profile) {
    debug("identify user for the amplitude only %O", profile)
    this.trackers.forEach(t => {
      const trackerClassName = t.constructor.name
      debug(
        "identify user amplitude tracker class name => %s",
        trackerClassName
      )
      if (trackerClassName === AMPLITUDE_TRACKER.CLASS_NAME)
        t.identifyUser(profile)
    })
  }
  /**
   * pass track event parameter to every registered tracker
   * @param {String} eventName the event name
   * @param {Object} eventProperties the event properties object to be passed to trackers
   */
  trackEvent(eventName, eventProperties) {
    debug("track event name:%s, withProp:%o", eventName, eventProperties)
    this.trackers.forEach(
      t => t.trackEvent && t.trackEvent(eventName, eventProperties)
    )
  }
  /**
   * pass alias user parameter to every registered tracker
   * @param {String} alias the alias to define alias of user
   */
  setAliasUser(alias) {
    debug("set alias user with name:%s", alias)
    this.trackers.forEach(t => t.setAliasUser && t.setAliasUser(alias))
  }
  /**
   * trigger logout method on each trackers
   */
  logout() {
    debug("=== RentSpree tracker logout method running... ===")
    this.trackers.forEach(t => t.logout && t.logout())
  }
}

export { FullStoryTracker } from "./tracker/fullstory"
export { GATracker } from "./tracker/ga"
export { BaseTracker } from "./tracker/base"
export { MixpanelTracker } from "./tracker/mixpanel"
export { AmplitudeTracker } from "./tracker/amplitude"
export { HubspotTracker } from "./tracker/hubspot"
export { HotjarTracker } from "./tracker/hotjar"
export { UserRecorderTracker } from "./tracker/user-recorder"
