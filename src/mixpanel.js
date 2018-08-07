import _ from "lodash"
// Mixpanel tracker class to tracking the event via mixpanel
export class MixpanelTracker {
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
  static getTracker() {
    if (window && window.mixpanel) {
      return window.mixpanel
    }
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    )
  }

  static checkReady() {
    if (window && window.mixpanel) {
      return !!window.mixpanel.__loaded // eslint-disable-line no-underscore-dangle
    }
    return false
  }

  callIfReady(fnName, recursive = 0, ...args) {
    if (recursive > 5) return // return when it had been recursively called for too much
    if (!MixpanelTracker.checkReady()) {
      setTimeout(() => {
        this.callIfReady(fnName, recursive + 1, ...args)
      }, 500)
    }
    // call the function
    this[fnName](...args)
  }

  _trackPageView(url, path) {
    MixpanelTracker.getTracker().track("page viewed", {
      url,
      path
    })
  }

  trackPageView(url, path) {
    this.callIfReady("_trackPageView", 0, url, path)
  }

  identifyUser(profile, ip) {
    MixpanelTracker.getTracker().identify(this.mapUserIdentity(profile))
    MixpanelTracker.getTracker().people.set(this.mapUserProfile(profile, ip))
  }

  _trackEvent(eventName, properties = {}) {
    MixpanelTracker.getTracker().track(eventName, properties)
  }

  trackEvent(eventName, properties = {}) {
    this.callIfReady("_trackEvent", 0, eventName, properties)
  }
}
