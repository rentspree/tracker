export default class Tracker {
  constructor() {
    this.trackers = []
  }
  registerTracker(trackerInstance) {
    this.trackers.push(trackerInstance)
  }
  trackPageView(url, path) {
    this.trackers.forEach(t => t.trackPageView && t.trackPageView(url, path))
  }
  identifyUser(profile) {
    this.trackers.forEach(t => t.identifyUser && t.identifyUser(profile))
  }
  trackEvent(eventName, eventProperties) {
    this.trackers.forEach(
      t => t.trackEvent && t.trackEvent(eventName, eventProperties)
    )
  }
}
