---
unlisted: true
title: Element Sizes & Scrolling
date: 2023-09-03
prev_article:
  path: /js/browser/styles-and-classes
  title: Styles & classes
next_article:
  path: /js/browser/coordinates
  title: Coordinates
---

# Element Sizes & Scrolling

## Sample element

```html
<div id="example">...Text...</div>
<style>
  #example {
    width: 300px;
    height: 200px;
    border: 25px solid #e6e6e6;
    padding: 20px;
    overflow: auto;
  }
</style>
```

[image]
  src: /img/js/element-sizes-and-scrolling.webp
  alt: Sample element

> Mind the scrollbar. If the scrollbar is `16px` wide then the content width remains only `300 - 16 = 284px`.

## Geometry

Here's the overall picture with geometry properties:

[image]
  src: /img/js/element-sizes-and-scrolling-1.webp
  alt: Geometry picture

- `offsetWidth`: The outer width = inner CSS-width + paddings + borders
- `offsetHeight`: The outer height = inner CSS-height + paddings + borders
- `clientLeft`: Left border width
- `clientTop`: Top border width
- `clientWidth`: The inner width = inner CSS-width + paddings (exclude scrollbar)
- `clientHeight`: The inner height = inner CSS-height + paddings (exclude scrollbar)
- `scrollWidth`: The full inner width including the scrolled out parts
- `scrollHeight`: The full inner height including the scrolled out parts
- `scrollTop`: _How much is scrolled up_
- `scrollLeft`: _How much is scrolled left_

## Don't take width/height from CSS

We should use geometry properties instead of `getComputedStyle`:

1. CSS `width/height` depend on another property: `box-sizing` that defines "what is" CSS width and
   height. A change in `box-sizing` for CSS purpose may break such JavaScript.
2. CSS `width/height` maybe `auto`

   ```html
   <span id="elem">Hello!</span>

   <script>
     alert(getComputedStyle(elem).width); // auto
   </script>
   ```

3. A scrollbar

## Window sizes and scrolling

### Width/height of the window

```javascript
documentElement.clientHeight;
documentElement.clientWidth;
```

> Not `window.innerWidth/innerHeight`
>
> ```javascript
> alert(window.innerWidth); // full window width
> alert(document.documentElement.clientWidth); // window width minus the scrollbar
> ```

### Width/height of the document

Theoretically, as the root document element is `document.documentElement`, and it encloses all the content,
we could measure the document's full size as `document.documentElement.scrollWidth/scrollHeight`.

But on that element, for the whole page, these properties do not work as intended. In Chrome/Safari/Opera, if
there's no scroll, then `documentElement.scrollHeight` may be even less than `documentElement.clientHeight`
! Weird, right?

To reliably obtain the full document height. we should take the maximum of these properties:

```javascript
let scrollHeight = Math.max(
  document.body.scrollHeight,
  document.documentElement.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.offsetHeight,
  document.body.clientHeight,
  document.documentElement.clientHeight
);
```

### Get the current scroll

DOM elements have their current scroll state in their `scrollLeft/scrollTop` properties.

For document scroll: `document.documentElement.scrollLeft/scrollTop`

Speical properties: `window.pageXOffset/pageYOffset`

> For historical reasons, these properties are the same:
>
> - `window.pageXOffset` is an alias of `window.scrollX`
> - `window.pageYOffset` is an alias of `window.scrollY`

### Scrolling: scrollTo, scrollBy, scrollIntoView

- `window.scrollBy(x,y)` - scrolls the page _relative to its current position_
- `widnow.scrollTo(pageX, pageY)` - scrolls the page to _absolute coordinates_, so that the top-left corner
  of the visible part has coordinates `(pageX, pageY)` ralative to the document's top-left corner. It's like setting
  `scrollLeft/scrollTop`

**_scrollIntoView_**

The call to `elem.scrollIntoView(top)` scrolls the page to make `elem` visible. It has one argument:

- If `top=true` (default), then the page will be scrolled to make `elem` appear on the top of the window. The
  upper edge of the element will be aligned with the window top.
- If `top=false`, then the page scrolls to make `elem` appear at the bottom. The bottom edge of the element
  will be aligned with the window bottom.

### Forbid the scrolling

```javascript
document.body.style.overflow = "hidden";
```
