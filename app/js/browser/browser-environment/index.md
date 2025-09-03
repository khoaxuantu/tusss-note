---
unlisted: true
title: Browser Environment Specifications
date: 2023-09-03
prev_article:
  path: /js/modules
  title: Modules
next_article:
  path: /js/browser/dom-tree
  title: DOM tree
---

# Browser Environment Specifications

The JavaScript language was intially created for web browsers. Since then, it has evolved into a language
with many uses and platforms.

A platform may be a browser, or a web-server or another _host_. The JavaScript specification calls that
a _host environment_.

A host environment provides its own objects and functions in addition to the language core. Web browsers
give a means to control web pages, Node.js provides server-side features, and so on.

Here's a tree view of what we have when JavaScript runs in web browser:

```
window
    |--- DOM
    |      |--- document
    |
    |--- BOM
    |      |--- navigator
    |      |--- screen
    |      |--- location
    |      |--- frames
    |      |--- history
    |      |--- XMLHttpRequest
    |
    |--- JavaScript
                |--- Object
                |--- Array
                |--- Function
                ...
```

There's a "root" objet called `window`. It has 2 roles:

1. It is a global object for JavaScript code.
2. It represents the "browser window" and provides methods to control it.

### DOM (Document Object Model)

The Document Object Model, or DOM for short, represents all page content as objects that can be modified.

The `document` object is the main "entry point" to the page.

```js
// change the background color to red
document.body.style.background = "red";

// change it back after 1 second
setTimeout(() => (document.body.style.background = ""), 1000);
```

> There's also a separate specification, [CSS Object Model (CSSOM)](https://www.w3.org/TR/cssom-1/) for
> CSS rules and stylesheets, that explains how they are represented as objects, and how to read and write
> them.
>
> The CSSOM is used together with the DOM when we modify style rules for the document. In practice though,
> the CSSOM is rarely required, because we rarely need to modify CSS rules from JavaScript, but that's
> also possible.

### BOM (Browser Object Model)

The Browser Object Model (BOM) represents additional objects provided by the browser (host environment)
for working with everything except the document.

For instance:

- The [navigator](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator) object provides
  background information about the browser and the operating system. The most widely known properties are:
    - `navigator.userAgent` - about the current browser
    - `navigator.platform` - about the platform (can help to differentiate between Windows/Linux/Mac etc)
- The [location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location) object allows us to
  read the current URL and can redirect the browser to a new one.

```js
  alert(location.href); // shows the current URL
  if (confirm("Go to Tuslipid?")) {
      location.href = "https://xuankhoatu.com";
  }
```
