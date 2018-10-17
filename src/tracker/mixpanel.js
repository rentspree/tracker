import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:mixpanel")

/**
 * Class For Mixpanel tracker
 * This is a complex class working directly with Mixpanel Lib
 * It ensure the readiness of Mixpanel.js library and prepare API for React
 * @extends BaseTracker
 */
export class MixpanelTracker extends BaseTracker {
  /**
   * Static method for getting the tracker from window
   * @returns {Object | Proxy} the mixpanel object, if the object is not existed in window.mixpanel,
   * this method will return Proxy to avoid error
   * @static
   */
  static getTracker() {
    if (window && window.mixpanel) {
      return window.mixpanel
    }
    debug("return proxy object for now")
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  /**
   * Check if mixpanel object is ready by checking `window.mixpanel.__loaded
   * @returns {Boolean} wether the mixpanel object is ready
   * @static
   */
  static checkReady() {
    if (window && window.mixpanel) {
      debug("mixpanel is ready: %s", window.mixpanel.__loaded) // eslint-disable-line no-underscore-dangle
      return !!window.mixpanel.__loaded // eslint-disable-line no-underscore-dangle
    }
    return false
  }

  callIfReady(fnName, recursive = 0, ...args) {
    if (recursive > 5) return // return when it had been recursively called for too much
    if (!MixpanelTracker.checkReady()) {
      setTimeout(() => {
        debug("postpone %s for 0.5 second", fnName)
        this.callIfReady(fnName, recursive + 1, ...args)
      }, 500)
    }
    // call the function
    this[fnName](...args)
  }

  _trackPageView(url, path, properties) {
    debug("track pageview for url:%s, path:%s", url, path, properties)
    MixpanelTracker.getTracker().track("page viewed", {
      url,
      path,
      ...properties
    })
  }

  /**
   * Track the page view by calling `mixpanel.track("page viewd", ...)`
   * @param {String} url the url to track
   * @param {String} path the path
   * @param {Object} properties the additional properties
   */
  trackPageView(url, path, properties = {}) {
    this.callIfReady("_trackPageView", 0, url, path, properties)
  }

  /**
   * Identify the user
   * this will call two mixpanel methods
   * - `mixpanel.identify` sending `mapUserIdentity(profile)`
   * - `mixpanel.people.set` sending (`mapUserProfile(profile)`
   * @param {Object} profile the user object to be mapped and sent to Mixpanel
   */
  identifyUser(profile, ip) {
    debug("identify user %o", profile)
    MixpanelTracker.getTracker().identify(this.mapUserIdentity(profile))
    MixpanelTracker.getTracker().people.set(this.mapUserProfile(profile, ip))
  }
  _trackEvent(eventName, properties = {}) {
    debug("track event for name:%s, properties:%o", eventName, properties)
    MixpanelTracker.getTracker().track(eventName, properties)
  }

  /**
   * Track the event by calling `mixpanel.track(eventName, properties)`
   * @param {String} eventName the eventName
   * @param {Object} properties the properties object to be passed to Mixpanel
   */
  trackEvent(eventName, properties = {}) {
    this.callIfReady("_trackEvent", 0, eventName, properties)
  }

  /**
   * Setup alias to identify user when that user signup successfully by calling `mixpanel.alias(alias)`
   * @param {String} alias the alias to define alias of user
   */
  setAliasUser(alias) {
    debug("set alias uesr with name:%s", alias)
    MixpanelTracker.getTracker().alias(alias)
  }
}
