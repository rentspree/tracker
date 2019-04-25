# rentspree-tracker

[![Generated with nod](https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square)](https://github.com/diegohaz/nod)
[![NPM version](https://img.shields.io/npm/v/@rentspree/tracker.svg?style=flat-square)](https://npmjs.org/package/@rentspree/tracker)
[![Build Status](https://img.shields.io/travis/rentspree/tracker/master.svg?style=flat-square)](https://travis-ci.org/rentspree/tracker) [![Coverage Status](https://img.shields.io/codecov/c/github/rentspree/tracker/master.svg?style=flat-square)](https://codecov.io/gh/rentspree/tracker/branch/master)

Tracking multiple analytics module for React

## Overview

This module is the tracking event wrapper for widespread analytics tools. It solve the problem for application
which integrates multiple analytics model by staggering events/pageview fire up and pass it through each of your config
analytic models.

## Install

    $ npm install --save @rentspree/tracker

## Usage

start by creating your new tracker

```js
import Tracker from "@rentspree/tracker"

const tracker = new Tracker()
```

then you must create your tracker instance, one provider per one tracker instance

For example, I will import GoogleAnalytic

```js
import {GATracker} from "@rentspree/tracker"

const gaTracker = new GATracker({trackerId: "the-tracker-id-from-ga"})
```

After this, you must register your new tracker instance to the Tracker

```js
tracker.registerTracker(gaTracker)
```

That's all the setup!
now upon your event, you can call

```js
tracker.trackEvent("ButtonClick", {data: "some-data"})
```

and the tracker will send the tracker event to _every_ register tracker. In this case, it's only gonna be
GoogleAnalytics that receive the tracking events.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Tracker](#tracker)
    -   [registerTracker](#registertracker)
    -   [trackPageView](#trackpageview)
    -   [identifyUser](#identifyuser)
    -   [trackEvent](#trackevent)
    -   [setAliasUser](#setaliasuser)
-   [AmplitudeTracker](#amplitudetracker)
    -   [getTracker](#gettracker)
    -   [identifyUser](#identifyuser-1)
    -   [trackEvent](#trackevent-1)
-   [BaseTracker](#basetracker)
    -   [trackPageView](#trackpageview-1)
    -   [identifyUser](#identifyuser-2)
    -   [trackEvent](#trackevent-2)
    -   [setAliasUser](#setaliasuser-1)
-   [FullStoryTracker](#fullstorytracker)
    -   [identifyUser](#identifyuser-3)
    -   [getTracker](#gettracker-1)
-   [GATracker](#gatracker)
    -   [trackPageView](#trackpageview-2)
    -   [identifyUser](#identifyuser-4)
    -   [trackEvent](#trackevent-3)
    -   [getTracker](#gettracker-2)
-   [MixpanelTracker](#mixpaneltracker)
    -   [trackPageView](#trackpageview-3)
    -   [identifyUser](#identifyuser-5)
    -   [trackEvent](#trackevent-4)
    -   [setAliasUser](#setaliasuser-2)
    -   [getTracker](#gettracker-3)
    -   [checkReady](#checkready)

### Tracker

The tracker class, this class will be the one place to trigger any tracking event
It will manage Instance that connect to each analytic provider
and call to track all of those providers api when one event occur.

#### registerTracker

Register the tracker Instance to track.
Each tracker must be initialize before register to the tracker

**Parameters**

-   `trackerInstance` **[BaseTracker](#basetracker)** the tracker to be tracked

**Examples**

```javascript
const tracker = new Tracker()
const gaTracker = new GATracker({trackerId: "hello-tracker"})
tracker.registerTracker(gaTracker)
// with this the gaTracker event handler will be fired everytime
// the tracker got an event
```

#### trackPageView

pass track pageview parameter to every registeredTracker

**Parameters**

-   `url` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the url to track
-   `path` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the path to track
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the additional properties object to be passed to trackers (optional, default `{}`)

#### identifyUser

pass identify user parameter to every regeisterd tracker

**Parameters**

-   `profile` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the profile object that will be passed through `mapUserIdentity` and `mapUserProfile` for each tracker instance.

#### trackEvent

pass track event parameter to every registered tracker

**Parameters**

-   `eventName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the event name
-   `eventProperties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the event properties object to be passed to trackers

#### setAliasUser

pass alias user parameter to every registered tracker

**Parameters**

-   `alias` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the alias to define alias of user

### AmplitudeTracker

**Extends BaseTracker**

The class for Amplitude tracker

**Parameters**

-   `options`  

#### getTracker

Static method for getting the amplitude tracker

Returns **([Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function) \| [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy))** the amplitude instance if it exist,
this method will return Proxy to avoid error

#### identifyUser

Identify the user by calling `setUserId(userId)`
the `userId` is a return from `options.mapUserIdentity(profile)`
the method also send user properties for identify user in amplitude by calling `identify(userPropertiesObj)`
the `userPropertiesObject` is a return from function `_setUserProperties(this.mapUserProfile(profile))` which will create amplitude's user identify object from mapped user data
the `mapUserProfile` should return the data with format below

```javascript
{
   id: {
     value: "this-is-user-id",
     setOnce: true
   }
}
```

 which value is the value of the key
 setOnce is indicator to set this key as unchangeable value in amplitude

**Parameters**

-   `profile` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the profile object

#### trackEvent

track the event by calling `logEvent("event name here", properties)`

**Parameters**

-   `eventName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the eventName
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the properties to be passed to amplitude (optional, default `{}`)

### BaseTracker

Base for all Tracker class

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** specify the tracker options

#### trackPageView

Dummy function for tracking page view

#### identifyUser

Dummy function for identify user

#### trackEvent

Dummy function for track event

#### setAliasUser

Dummy function for set alias of user

### FullStoryTracker

**Extends BaseTracker**

The class for FullStory tracker

#### identifyUser

send the identity of this user to FullStory

-   the identity of the user is the return from `options.mapUserIdentity(profile)`
-   the user detail is the return from `options.mapUserProfile(profile)`
    The method simply call `FA.identity(options.mapUserIdentity(profile), options.mapUserProfile(profile))`

**Parameters**

-   `profile` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the user object

#### getTracker

Static method for getting the tracker from window

Returns **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy))** the FA object, if the function is not existed in `window.FA`,
this method will return Proxy to avoid error

### GATracker

**Extends BaseTracker**

The class for Google analytic tracker

**Parameters**

-   `options`  

#### trackPageView

Track the page view by calling `gtag("config", trackingId, {page_locationi: url, page_path: path})`

**Parameters**

-   `url` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the url to track, this will be passed to `page_location` key
-   `path` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the path, this will be passed to `page_path` key
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the additional properties
    -   `properties.ipAddress`  

#### identifyUser

Identify the user by calling `gtag("config", ...userObject)`
the `userObject` is a return from `options.mapUserProfile(profile)`

**Parameters**

-   `profile` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the profile object

#### trackEvent

track the event by calling `gtag("event", eventName, properties)`

**Parameters**

-   `eventName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the eventName
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the properties to be passed to gtag (optional, default `{}`)

#### getTracker

Static method for getting the tracker from window

Returns **([Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function) \| [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy))** the gtag function, if the function is not existed in window.gtag,
this method will return Proxy to avoid error

### MixpanelTracker

**Extends BaseTracker**

Class For Mixpanel tracker
This is a complex class working directly with Mixpanel Lib
It ensure the readiness of Mixpanel.js library and prepare API for React

#### trackPageView

Track the page view by calling `mixpanel.track("page viewd", ...)`

**Parameters**

-   `url` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the url to track
-   `path` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the path
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the additional properties (optional, default `{}`)

#### identifyUser

Identify the user
this will call two mixpanel methods

-   `mixpanel.identify` sending `mapUserIdentity(profile)`
-   `mixpanel.people.set` sending (`mapUserProfile(profile)`

**Parameters**

-   `profile` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the user object to be mapped and sent to Mixpanel
-   `ip`  

#### trackEvent

Track the event by calling `mixpanel.track(eventName, properties)`

**Parameters**

-   `eventName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the eventName
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the properties object to be passed to Mixpanel (optional, default `{}`)

#### setAliasUser

Setup alias to identify user when that user signup successfully by calling `mixpanel.alias(alias)`

**Parameters**

-   `alias` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the alias to define alias of user

#### getTracker

Static method for getting the tracker from window

Returns **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy))** the mixpanel object, if the object is not existed in window.mixpanel,
this method will return Proxy to avoid error

#### checkReady

Check if mixpanel object is ready by checking \`window.mixpanel.\_\_loaded

Returns **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** wether the mixpanel object is ready

## License

MIT © [Putt](https://github.com/rentspree)
