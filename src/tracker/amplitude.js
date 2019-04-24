import createDebug from "debug"
import { BaseTracker } from "./base"

const debug = createDebug("rentspree-tracker:amplitude")

/**
 * The class for Amplitude tracker
 * @param {String} options.amplitudeSDK the amplitude SDK
 * @param {String} options.apiKey the api key of amplitude
 * @extends BaseTracker
 */
export class AmplitudeTracker extends BaseTracker {
  constructor(options) {
    super(options)
    this.amplitudeSDK = options.amplitudeSDK
    this.apiKey = options.apiKey
    this.setOnceKey = options.setOnceKey || []
    if (this.amplitudeSDK && this.apiKey) {
      debug("initialize Amplitude for Instance %o", options.amplitudeSDK)
      debug("initialize Amplitude Instance for API KEY %o", options.apiKey)
      this.getTracker().init(this.apiKey)
    }
  }
  /**
   * Static method for getting the amplitude tracker
   * @returns {Function | Proxy} the amplitude instance if it exist,
   * this method will return Proxy to avoid error
   */
  getTracker() {
    if (this.amplitudeSDK) {
      debug("return amplitude instance")
      return this.amplitudeSDK.getInstance()
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
   * Identify the user by calling `setUserId(userId)`
   * the `userId` is a return from `options.mapUserIdentity(profile)`
   * the method also send user properties for identify user in amplitude by calling `identify(userPropertiesObj)`
   * the `userPropertiesObject` is a return from function `_setUserProperties(this.mapUserProfile(profile))` which will create amplitude's user identify object from mapped user data
   * the `mapUserProfile` should return the data with format { key: { value, setOnce }}
   * @example
   * {
   *    id: {
   *      value: "this-is-user-id",
   *      setOnce: true
   *    }
   * }
   * // which value is the value of the key
   * // setOnce is indicator to set this key as unchangeable value in amplitude
   * @param {Object} profile the profile object
   */
  identifyUser(profile) {
    debug("identify user %o", profile)
    const mappedIdentity = this.mapUserIdentity(profile)
    const mappedProfile = this.mapUserProfile(profile)
    debug("mappedProfile %o", mappedProfile)
    const amplitudeUserIdentifierObj = this._setUserProperties(mappedProfile)
    debug("amplitude.identify(%o)", amplitudeUserIdentifierObj)
    this.getTracker().identify(amplitudeUserIdentifierObj)
    debug("amplitude.setUserId(%s)", mappedIdentity)
    this.getTracker().setUserId(mappedIdentity)
  }

  _setUserProperties(mappedProfile = {}) {
    const identifyObj = new this.amplitudeSDK.Identify()
    const keys = Object.keys(mappedProfile)
    keys.forEach(key => {
      if (mappedProfile[key].setOnce) {
        identifyObj.setOnce(key, mappedProfile[key].value)
      } else {
        identifyObj.set(key, mappedProfile[key].value)
      }
    })
    return identifyObj
  }
}
