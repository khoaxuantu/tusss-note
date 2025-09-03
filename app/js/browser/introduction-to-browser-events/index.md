---
unlisted: true
title: Introduction to Browser Events
date: 2023-09-03
prev_article:
  path: /js/browser/styles-and-classes
  title: Styles & classes
next_article:
  path: /js/browser/introduction-to-browser-events
  title: Introduction to browser events
---

# Introduction To Browser Events

Here's a list of the most useful DOM events:

**Mouse events:**

- `click` when the mouse click on an element
- `contextmenu` when the mouse right-clicks on an element
- `mouseover` / `mouseout` when the mouse cursor comes over / leaves an element
- `mousedown` / `mouseup` when the mouse button is pressed / released over an element
- `mousemove` when the mouse is moved

**Keyboard events:**

- `keydown` and `keyup` when a keyboard key is pressed and released

**Form element events:**

- `submit` when the visitors submits a `<form>`
- `focus` when the visitor focuses on an element, e.g. on an `<input>`

**Document events:**

- `DOMContentLoaded` when the HTML is loaded and processed, DOM is fully built

**CSS events:**

- `transitioned` when a CSS-animation finishes

## Event handlers

To react on events we can assign a _handler_ - a function that runs in case of an event.

### HTML-attribute

A handler can be set in HTML with an attribute named `on<event>`.

```html
<input value="Slap me" onclick="alert('Slapped!')" type="button" />
```

### DOM property

We can assign a handler using a DOM property `on<event>`.

```html
<input id="elem" type="button" value="Slap me" />
<script>
  const elem = document.getElementById("elem");
  elem.onclick = function () {
    alert("Ouch...");
  };
</script>
```

## Possible mistakes

We can set an existing function as a handler. But be careful: the function should be assigned without parentheses

```js
function sayThanks() {
  alert("Thanks!");
}

elem.onclick = sayThanks; // ok
elem.onclick = sayThanks(); // nope
```

If we add parentheses, then `sayThanks()` becomes a function call. So the last line actually takes the _result_ of the function execution,
that is `undefined` (as the function returns nothing), and assigns it to `onclick`. That's doesn't work because we need to assign the
function.

...On the other hand, in the markup we do need the parentheses:

```html
<input type="button" id="button" onclick="sayThanks()" />
```

When the browser reads the attribute, it creates a handler function with body from the attribute content.

> Don't use `setAttribute` for handlers. Such a call won't work:
>
> ```js
> // a click on <body> will generate errors,
> // because attributes are always strings, function becomes a string
> document.body.setAttribute("onclick", function () {
>   alert(1);
> });
> ```

## addEventListener

The fundamental problem of the aforementioned ways to assign handlers is that we _can't assign multiple handlers to one event._

Developers of web standards understood that long ago and suggested an alternative way of managing handlers using the special methods
`addEventListener` and `removeEventListener` which aren't bound by such constaint.

The syntax to add a handler:

```js
element.addEventListener(event, handler, [options]);
```

- `event` - Event name, e.g. `"click"`
- `handler` - The handler function.
- `options` An addition optional object with properties:
  - `once: boolean`: if `true`, then the listener is automatically removed after it triggers.
  - `capture: boolean`: the phase where to handle the event.
  - `passive: boolean`: if `true`, then the handler will not call `preventDefault()`

To remove the handler, use `removeEventListener`:

```js
element.removeEventListener(event, handler);
```

## Event object

To properly handle an event we'd want to know more about what's happened. Not just a "click" or a "keydown", but whate were the pointer
coordinates? Which key was pressed? And so on.

When an event happens, the browser creates an _event object_, puts details into it and passes it as an argument to the handler.

```js
elem.onclick = function (event) {
  // show event type, element and coordinates of the click
  alert(event.type + " at " + event.currentTarget);
  alert("Coordinates: " + event.clientX + ":" + event.clientY);
};
```

## Object handlers: handleEvent

We can assign not just a function, but an object as an event handler using `addEventListener`. When an event occurs, its 'handleEvent'
method is called.

```js
let obj = {
  handleEvent(event) {
    alert(event.type + " at " + event.currentTarget);
  },
};

elem.addEventListener("click", obj);
```
