import createDebug from "debug"

const debug = createDebug("rentspree-tracker:main")

export default class Tracker {
  constructor() {
    debug("Initialize Tracker class")
    this.trackers = []
  }
  registerTracker(trackerInstance) {
    debug("pushing %o tracker to main tracker", trackerInstance)
    this.trackers.push(trackerInstance)
  }
  trackPageView(url, path) {
    debug("track pageview for url:%s path:%s", url, path)
    this.trackers.forEach(t => t.trackPageView && t.trackPageView(url, path))
  }
  identifyUser(profile) {
    debug("identify user %O", profile)
    this.trackers.forEach(t => t.identifyUser && t.identifyUser(profile))
  }
  trackEvent(eventName, eventProperties) {
    debug("track event name:%s, withProp:%o", eventName, eventProperties)
    this.trackers.forEach(
      t => t.trackEvent && t.trackEvent(eventName, eventProperties)
    )
  }
}

export { FullStoryTracker } from "./tracker/fullstory"
export { GATracker } from "./tracker/ga"
export { BaseTracker } from "./tracker/base"
export { MixpanelTracker } from "./tracker/mixpanel"
