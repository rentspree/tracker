import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:mixpanel")
// Mixpanel tracker class to tracking the event via mixpanel
export class MixpanelTracker extends BaseTracker {
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

  _trackPageView(url, path) {
    debug("track pageview for url:%s, path:%s", url, path)
    MixpanelTracker.getTracker().track("page viewed", {
      url,
      path
    })
  }

  trackPageView(url, path) {
    this.callIfReady("_trackPageView", 0, url, path)
  }

  identifyUser(profile, ip) {
    debug("identify user %o", profile)
    MixpanelTracker.getTracker().identify(this.mapUserIdentity(profile))
    MixpanelTracker.getTracker().people.set(this.mapUserProfile(profile, ip))
  }

  _trackEvent(eventName, properties = {}) {
    debug("track event for name:%s, properties:%o", eventName, properties)
    MixpanelTracker.getTracker().track(eventName, properties)
  }

  trackEvent(eventName, properties = {}) {
    this.callIfReady("_trackEvent", 0, eventName, properties)
  }
}
