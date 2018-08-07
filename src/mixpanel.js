// Mixpanel tracker class to tracking the event via mixpanel
export class MixpanelTracker {
  static getTracker() {
    if (window && window.mixpanel) {
      return window.mixpanel;
    }
    return new Proxy(
      {},
      {
        get: () => () => {}
      }
    );
  }

  static checkReady() {
    if (window && window.mixpanel) {
      return !!window.mixpanel.__loaded; // eslint-disable-line no-underscore-dangle
    }
    return false;
  }

  trackPageView(url, path, recursive = 0) {
    if (recursive > 5) return;
    if (!MixpanelTracker.checkReady()) {
      setTimeout(() => {
        this.trackPageView(url, path, recursive + 1);
      }, 500);
      return;
    }
    MixpanelTracker.getTracker().track("page viewed", {
      url,
      path
    });
  }

  identifyUser(profile, ip) {
    MixpanelTracker.getTracker().identify(profile.email);
    MixpanelTracker.getTracker().people.set({
      $first_name: profile.firstName,
      $last_name: profile.lastName,
      $created: profile.createdAt,
      $email: profile.email,
      $phone: profile.phone,
      registeredUserType: profile.registeredUserType,
      userType: profile.userType,
      "Public IP": ip
    });
  }

  trackEvent(eventName, properties = {}, recursive = 0) {
    if (recursive > 5) return;
    if (!MixpanelTracker.checkReady()) {
      setTimeout(() => {
        this.trackEvent(eventName, properties, recursive + 1);
      }, 500);
      return;
    }
    MixpanelTracker.getTracker().track(eventName, properties);
  }
}
