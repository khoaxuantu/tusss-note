---
unlisted: true
title: Coordinates
date: 2023-09-03
next_article:
  path: /js/browser/styles-and-classes
  title: Styles & classes
prev_article:
  path: /js/browser/introduction-to-browser-events
  title: Introduction to browser events
---

# Coordinates

Most JavaScript methods deal with one of 2 coordinate systems:

1. **Relative to the window** - similar to `position: fixed`, calculated from the window top/left edge.

   We'll denote these coordinates as `clientX/clientY`.

2. **Relative to the document** - similar to `position: absolute` in the document root, calculated from the
   document top/left edge. - We'll denote them `pageX/pageY`.

## Element coordinates: getBoundingClientRect

```javascript
elem.getBoundingClientRect();
```

Returns window coordinates for a minimal rectangle that encloses `elem` as an object of built-in
[DOMRect](https://www.w3.org/TR/geometry-1/#domrect) class.

Main `DOMRect` properties:

- `x/y`: X/Y-coordinates of the rectangle origin relative to window.
- `width/height`: width/height of the rectangle (can be negative).

Additionally, there are derived properties:

- `top/bottom`: Y-coordinates for the top/bottom rectangle edge.
- `left/right`: X-coordinates for the left/right rectangle edge.

Output

```ts
x: 10;
y: 314.82812;
width: 419.796875;
height: 21;
top: 314.82812;
bottom: 335.828125;
left: 10;
right: 429.796875;
```

As you can see, `x/y` and `width/height` fully describe the element. Derived properties can be easily calculated
from them:

- `left = x`
- `top = y`
- `right = x + width`
- `bottom = y + height`

> - Coordinates may be decimal fractions, e.g. `10.5`.
>
> - Coordinates may be negative. For instance, if the page is scrolled so that `elem` is now above the window.

## elementFromPoint(x,y)

```javascript
let elem = document.elementFromPoint(x, y);
```

Returns the most nested element at window coordinates `(x,y)`.

## Document coordinates

The 2 coordinates systems are connected by the formula:

- `pageY` = `clientY` + height of the scrolled-out vertical part of the document.
- `pageX` = `clientX` + width of the scrolled-out horizontal part of the document.

```javascript
function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset,
  };
}
```
