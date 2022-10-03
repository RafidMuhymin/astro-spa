# Welcome to Astro SPA 👋

[![npm package](https://img.shields.io/npm/v/astro-spa?style=for-the-badge)](https://npmjs.org/package/astro-spa)
[![npm downloads](https://img.shields.io/npm/dt/astro-spa?style=for-the-badge)](https://npmcharts.com/compare/astro-spa)
[![snyk vulnerability score](https://img.shields.io/snyk/vulnerabilities/npm/astro-spa?style=for-the-badge)](https://snyk.io/advisor/npm-package/astro-spa#security)
[![license](https://img.shields.io/npm/l/astro-spa?style=for-the-badge)](https://github.com/rafidmuhymin/astro-spa/blob/main/license.md)
[![npm maintenance score](https://img.shields.io/npms-io/maintenance-score/astro-spa?style=for-the-badge)](https://npmjs.org/package/astro-spa)
[![npm maintenance score](https://img.shields.io/badge/prs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/rafidmuhymin/astro-spa/pulls)

The Six UI frameworks supported by **Astro** for templating are primarily used for building _Single Page Applications_. But the application it generates isn't a SPA.

So to enjoy the advantages of a SPA, you can install **Astro SPA** to turn your existing Astro project into SPA. It's not only just a SPA component/library but it comes with many other features also.

## Installing the plugin

Once you have set up your **Astro** project simply run the following command:

```bash
# yarn
yarn add astro-spa

# npm
npm i astro-spa

# pnpm
pnpm add astro-spa
```

Then import the component like this:

```astro
---
import { Spa } from "astro-spa";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro-SPA</title>
  </head>
  <body>
    <h1>Astro-SPA</h1>
    <Spa />
  </body>
</html>
```

And that's it, you're now ready to go!

## Why Astro SPA?

Why _Astro SPA_? It's a good question. Well, **Astro SPA** is a SPA component/library that is built using **Astro** components. That means, it utilizes all the exclusive features of **Astro** components!

By default, **Astro SPA** will ship only **1278** bytes of JS code (min+gzipped)! And if you configure it and remove some features, it can ship even less than 1KB! Thanks to **Astro** components, we can detect which features are used and which are not on the server-side and generate only the required JS code.

But even with that small size, **Astro SPA** comes with a lot of features that aren't available in other SPA libraries. It comes with _animations_, _caching_, _containerization_, _local link detection_, _prefetching_, _progress bar_, and more (Check below for more details)! All of these in that extremely small file size!

## Features

### Prefetching

_Prefetching_ is a feature that allows you to load the page content before the user visits it for blazing-fast navigation. Prefetching is enabled by default. So, you can enjoy the benefits without having to worry about configuring **Astro SPA**.

**Astro SPA** prefetches the internal links using the _Intersection Observer API_. So, it won't start prefetching until the user reaches the link and thus it saves bandwidth. It also upgrades to fetch requests on `mouseover` and `touchstart` events if the resource hasn't been fetched already. It also caches the prefetched resources using the _Cache API_ to avoid extra network requests.

If you want to disable prefetching, you can do so by tweaking the `prefetch` prop to `false`.

### Single Page Navigation

When you click on an internal link, **Astro SPA** will intercept the click and try to serve the request from the cache. If the resource is not in the cache, it will fetch the requested page and replace the current `documentElement` with the new `documentElement`.

### Containerization

If you want to replace only a specific part of the page, you can use the `containerSelector` prop to specify the selector of the container. **Astro SPA** will replace the content of the container with the content of the new container.

### Back/Forward Navigation

The back/forward navigation works as usual when using **Astro SPA**. It works by intercepting the `popstate` event and replacing the current content with the new content.

### Scripts

**Astro SPA** will execute every script the new page has. If you are using containerization, it'll execute scripts only in the container and the head of the new document. Check the section, [Script Execution in Astro SPA](#script-execution-in-astro-spa) for more details.

### Showing Progress Bar

By default, **Astro SPA** will show a progress bar while the new page is loading. You can disable this by tweaking the `progressBar` prop to `false`. You can also configure the progress bar by passing the `progressBarOptions` prop to the `<Spa />` component (Check below for more details).

There are two types of progress bars in **Astro SPA**. The first one is similar to the one shown in the [ReactJS](https://reactjs.org/) website. The second one is similar to the one shown in the [PreactJS](https://preactjs.com/) website. The first one is the default one. You can also choose the second one by passing the `{ secondary: true }` option to the `progressBarOptions` prop.

### Fade In Animation

By default, **Astro SPA** will show a fade-in animation when the new page loads. You can disable this by tweaking the `defaultAnimation` prop to false.

You can also add your own animation using the lifecycle events provided by **Astro SPA**. One caveat is that you'll have to write the animation logic from scratch. There are plans to ease the animation process in the future which will utilize the new **Shared Elements Transitions** which is planned to be released in _Chrome v97_. The expected release date of _Chrome v97_ is _January 4, 2022_.

### Data Saver

To avoid wasting the limited bandwidth of the user, no links will be prefetched if the user has turned on data saver. And also links will be prefetched only if they are in the viewport for more than 500ms (500ms is the default value).

You can also limit the number of prefetched resources by passing the `limit` prop to the `<Spa />` component (Check below for more details).

### Caching

The prefetched and fetched resources are cached using the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache). Caching is enabled by default so you don't have to worry about configuring anything.

The entire cache is cleared on page load/reloads to ensure there's no stale content. If you want to clear the cache, you can do so by calling `caches.delete("astro-spa")`.

## Script Execution in Astro SPA

**Astro SPA** is a SPA framework and it works within a single page. So, your scripts have to be written in a way that they can be executed without clashing with the scripts of the current page.

For example, you should wrap your scripts with IIFEs (Immediately Invoked Function Expression). Otherwise, if you have constant variables in your scripts, you may get a `TypeError` like `Uncaught TypeError: Assignment to constant variable`.

Also, you should place the `<Spa />` component after all the body content. Otherwise, the **Astro SPA** code may get executed when no links are available on the page. If you still want to put the `<Spa />` component in the head, you'll have to call the `spa.scan()` function after all the body content.

Another thing to note is that no `load` or `DOMContentLoaded` events will be triggered on the new page. To combat this, you can utilize the `navigate` and `mount` lifecycle events (Check below for more details).

And, don't use the `window.location.reload()` method. It will clear the entire cache and thus you will lose the content of the new page. Instead, use the `spa.navigate()` method to reload the current page. For example, if you want to reload the current page, you can do so by writing the following code:

```js
spa.navigate(location.pathname, { replace: true });
```

## How to Use Analytics with Astro SPA

Analytics solutions are very popular and used to provide insights into the user's behavior. It's an important feature for most websites to have.

### Google Analytics

**Astro SPA** comes with built-in support for Google Analytics. You can use the `analytics` prop to configure the Google Analytics tracking code (Check below for more details). It's inspired by the [_Minimal Google Analytics_](https://minimalanalytics.com/) project by _DavidKuennen_. The _analytics_ only add _478 bytes_ to the bundle size (min+gzipped).

One thing to note is that the analytics solution provided by **Astro SPA** has a built-in _Unique User Identification_ mechanism. To comply with the [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) regulations, it doesn't store any _data_ in the user's browser/device. It takes the user's IP address and the value of `navigator.userAgent` & `new Date().getFullYear()` and creates a _hash_ of it. This hash is then used to identify a unique user.

It's important to note that the _Unique User Identification_ mechanism is not 100% accurate. It's possible that the same user will be identified as a different user and multiple users will be counted as a single user.

A big problem with counting multiple users as a single user is that it can grow exponentially over time if an extremely large number of users visit a website . This is why **Astro SPA** also takes `new Date().getFullYear()` into account when creating the hash. Though a year is a long time, it still greatly reduces the number of duplicate users. You can tweak this also by passing the `trackingPeriod` key to the `analytics` object prop (Check below for more details).

The analytics solution also exposes two helper functions to track events and exceptions. The first one is `spa.trackEvent()` and the second one is `spa.trackException()`.

> **Note:** If you want to disable the _Unique User Identification_ mechanism, you can do so by tweaking the `fingerprinting` prop to `false`. If disabled the _cid_ will be generated by hashing the values of `Math.random()` and `new Date()`. Note that the value of the _cid_ is generated every time the page is loaded. But as Astro SPA is a SPA library, the _cid_ will be generated only once. So, the user will still be counted as a single user per session until the page is reloaded.

### Other Analytics Solutions

**Astro SPA** doesn't have any other analytics solution built-in. But, you can integrate any other analytics solution you want with **Astro SPA**. You can use the `navigate` and `mount` lifecycle events to track the user when he navigates away from one page to another page.

## API Documentation

### Helpers

There are a total of 4 helper functions that you can use in your **Astro SPA** project.

#### spa.prefetch

You can use the `prefetch` function to prefetch links programmatically. It accepts a single parameter, which is the link to be prefetched.

```js
const url = "https://example.com";
spa.prefetch(url); // window.spa.prefetch(url)
```

#### spa.navigate

You can use the `navigate` function to navigate to a link programmatically. It accepts a single parameter, which is the link to be navigated.

```js
const searchQuery = "query";
spa.navigate(`/search?${searchQuery}`); // window.spa.navigate(`/search?${searchQuery}`)
```

#### spa.observe

You can use the `observe` function to start observing a new link programmatically. It accepts a single parameter, which is the link to be observed. It'll prefetch and add proper event handlers to the link.

```js
const newLink = document.querySelector("#new-link");
spa.observe(newLink); // It will start observing the new link
```

#### spa.scan

You can use the scan helper function to start observing all the new links injected later into the document via JS like observe function.

You can use the `scan` function to start observing all the new links injected later into the document via JavaScript. It doesn't accept any parameters.

```js
const newLinks = ["a link", "another link", "a third link"];

newLinks.forEach((link) => {
  document.body.appendChild(link);
});

spa.scan(); // It will start observing all the new three links
```

### Lifecycle Events

There are a total of 2 lifecycle events that you can use in your **Astro SPA** project, which are `navigate` and `mount`.

#### navigate

You can use the `navigate` lifecycle event to execute code when the user clicks on a new link.

```js
window.addEventListener("navigate", () => {
  console.log("navigated");
});

// or

window.onNavigate = () => {
  console.log("navigated");
};
```

#### mount

You can use the `mount` lifecycle event to execute code when the user navigates to a new page. The event is called after the new document is rendered and all the scripts have been executed.

```js
window.addEventListener("mount", () => {
  console.log("mounted");
});

// or

window.onMount = () => {
  console.log("mounted");
};
```

## Configuration Options (Supported Props for the `<Spa />` Component)

There are a total of 21 configuration options that can be passed to the `<Spa />` component. All of them are optional. Among them, three are `object` type and has children configuration options. All of the configuration options, their types, default values, and descriptions are listed below.

### analytics

Type: `analytics` (Check below for more details)

Default: `analytics`

**Astro SPA** comes with built-in support for Google Analytics. You can use the `analytics` prop to configure the Google Analytics tracking code. Check the section, [Google Analytics](#google-analytics) for more details. The `analytics` prop accepts an object with the following properties:

```ts
export interface analytics {
  trackingID: string; // The tracking ID of the Google Analytics account
  anonymizeIP?: boolean; // Whether to anonymize the IP address of the user
  colorDepth?: boolean; // Whether to track the color depth of the user's screen
  characterSet?: boolean; // Whether to track the character set of the user's browser
  screenSize?: boolean; // Whether to track the screen size of the user's browser
  language?: boolean; // Whether to track the language of the user's browser
  fingerprinting?: boolean; // Whether to use browser fingerprinting techniques to identify unique users
  trackingPeriod?: number; // The amount of time to track the user's browser
}

// Defaults

const analytics: analytics = {
  trackingID: "",
  anonymizeIP: true,
  colorDepth: true,
  characterSet: true,
  screenSize: true,
  language: true,
};
```

### attributes

Type: `Partial<HTMLScriptElement>`

Default: `undefined`

The attributes supported by the `<script>` element. You have to write the attributes in the following format: `{ attributeName: attributeValue }`. For example, `{ async: true }`.

### cache

Type: `boolean`

Default: `true`

Whether or not Cache API will be used for caching the fetched and prefetched resources.

### containerSelector

Type: `string`

Default: `""`

Example: `"#root"`

The `querySelector` of the content container of the page, which will get replaced instead of the whole document.

### defaultAnimation

Type: `boolean`

Default: `true`

Whether or not the default fade-in animation will be displayed while the new page loads.

### delay

Type: `number`

Default: `500`

The amount of time each link has to stay inside the viewport before being prefetched, in milliseconds.

### external

Type: `boolean`

Default: `false`

Whether the code should be included in an external JavaScript file or be inlined. If enabled, the hash of the code will be appended to the filename.

> **Note:** To create an external script the Node Api is used. In Deno/Cloudflare/etc. Environments this will always be `false` and can not be changed

### forceRequestIdleCallback

Type: `boolean`

Default: `false`

Whether or not the code will fall back to `setTimeout` if the browser doesn't support `requestIdleCallback`.

> **Note:** No polyfill gets included when this option is set to true.

### highPriorityPrefetch

Type: `boolean`

Default: `false`

Whether or not the internal links will be prefetched with a higher priority.

### ignores

Type: `string[]`

Default: `undefined`

The URLs, which should not be fetched or prefetched. However, they won't be excluded from SPA navigation.

### intersectionObserverOptions

Type: `IntersectionObserverInit` (Check below for more details)

Default: `IntersectionObserverInit`

The `options` object for the `IntersectionObserver` constructor used for prefetching. It's a bit different from the original `options` object of the `IntersectionObserver` constructor. The full interface of the `IntersectionObserverInit` object is as follows:

```ts
export interface IntersectionObserverInit {
  root?: string; // The querySelector of the HTML element to observe for in-viewport links to prefetch. However, the links will be fetched on the mouseover and touchstart events. Example: "#viewport".
  rootMargin?: string; // The CSS margin property for the margin around the root element.
  threshold?: number | number[]; // The percentage of the area of each link that must have entered the viewport to be fetched, in its decimal form (0.25 = 25%).
}

// Defaults

const intersectionObserverOptions: IntersectionObserverInit = {
  root = "",
  rootMargin = "",
  threshold = 0.25,
};
```

### limit

Type: `number`

Default: `undefined`

The maximum number of links that can be prefetched.

### localLinkDetector

Type: `boolean`

Default: `true`

Whether or not the code will check for if any element is using the `data-active-class` attribute and whether its `href` matches the current URL or not.

### prefetch

Type: `boolean`

Default: `true`

Whether or not the internal links will be prefetched.

### prefetchUpgradation

Type: `boolean`

Default: `true`

Whether or not the prefetching of the internal links will be upgraded to fetch on `mouseover` and `touchstart` events.

### progressBar

Type: `boolean`

Default: `true`

Whether or not the progress bar will be displayed.

### progressBarOptions

Type: `progressBarOptions` (Check below for more details)

Default: `progressBarOptions`

When the `progressBar` prop is set to `true` (default), you can customize the progress bar by passing the `progressBarOptions` object. The full interface is as follows:

```ts
export interface progressBarOptions {
  height?: string; // The height of the progress bar in CSS units.
  secondary?: boolean; // Whether or not the secondary progress bar will be displayed. Check the section, [Showing Progress Bar](#showing-progress-bar) for more details.
  colors?: {
    foreground?: string; // The foreground color of the progress bar.
    background?: string; // The background color of the progress bar. This option is only respected when the `secondary` option is set to true.
  };
}

// Defaults

const progressBarOptions: progressBarOptions = {
  height: "1vh",
  secondary: false,
  colors: {
    foreground: "#42b3f5",
    background: "#4248f5",
  },
};
```

### scanOnMount

Type: `boolean`

Default: `true`

Whether or not the code will scan the DOM on `mount` and prefetch the new links.

### scrollIntoView

Type: `boolean`

Default: `true`

Whether or not the new `documentElement` or the new content container will be scrolled into view using `Element.scrollIntoView()`.

### scrollIntoViewOptions

Type: `boolean` | `scrollIntoViewOptions`

Default: `{ behavior: "smooth" }`

The boolean parameter or the parameter object for the `scrollIntoView` function. For more details, check the MDN documentation of the [Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) function.

### timeout

Type: `number` or `false` (`true` is not a valid value)

Default: `2000`

The value of the `timeout` property of the `options` object parameter of the `requestIdleCallback` function. Check the MDN documentation of the [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/requestIdleCallback) function for more details.

If the `timeout` prop is set to `false`, no `timeout` will be set for the `requestIdleCallback` function.

> **Note:** There's a difference between `{ timeout : 0 }` and no `timeout` at all. The former will schedule the `idleCallback` function to be run asynchronously and will call the function after the shortest possible delay. And the latter won't call the `idleCallback` function until the main thread is free.

## Supported Data Attributes

### data-spa-ignore

Type: `boolean`

If present, the link won't be prefetched or navigated to.

### data-spa-no-prefetch

Type: `boolean`

If present, the link won't be prefetched.

### data-spa-high-priority-prefetch

Type: `boolean`

If present, the link will be prefetched with a higher priority.

### data-spa-no-prefetch-upgradation

Type: `boolean`

If present, prefetching of the link won't be upgraded to fetch on `mouseover` and `touchstart` events.

### data-active-class

Type: `string`

If the `localLinkDetector` prop is set to `true`, and the `data-active-class` attribute is present, the link will be prefetched when the `href` attribute matches the current URL or not.

## Demo

https://softhardsystem.com/ (It's a production website)

https://astro-spafy-component-demo.netlify.app/

https://ohka-bots-site-astro-ksoqn4flk7-li4hm4z1a-tc-001.vercel.app/ (Thanks to @Tc-001)

## v2

There are plans to release v2 which will utilize the new **AppHistory API** that is planned to be shipped in _Chrome v100_. The expected release date of _Chrome v100_ is _March 29, 2021_ according to the new four-week release cycle.
