---
unlisted: true
title: Walking the DOM
date: 2023-09-03
prev_article:
  path: /js/browser/dom-tree
  title: DOM tree
next_article:
  path: /js/browser/node-properties
  title: Node properties
---

# Walking The DOM

The DOM allows us to do anything with elements and their contents, but first we need to reach the
corresponding DOM object. All operations on the DOM start with the `document` object - the main
"entry point".

[image]
  src: /img/js/walking-the-dom.webp
  alt: DOM nodes

## On top: documentElement and body

```html
<html>
  = document.documentElement
  <body>
    = document.body
    <head>
      = document.head
    </head>
  </body>
</html>
```

> `document.body` can be `null`

## Children: childNodes, firstChild, lastChild

There are 2 terms that we'll use from now on:

- **Child nodes (or children)** - elements that are direct children. For instance, `<head>` and `<body>`
  are children of `<html>` element.
- **Descendants** - all elements that are nested in the given one, including children, their children,
  and so on.

```js
childNodes - lists all child nodes, including text nodes
firstChild - gives fast access to the first children
lastChild - gives fast access to the last children
```

## DOM collections

As we can see, `childNodes` looks like an array. But actually it's not an array, but rather a _collection_ - a special array - like iterable object.

There are 2 important consequences:

- We can use `for..of` to iterate over it:
  ```js
  for (let node of document.body.childNodes) {
    console.log(node);
  }
  ```
- Array methods won't work, because it's not an array:
  ```js
  alert(document.body.childNodes.filter); // undefined (there's no filter method)
  alert(Array.from(document.body.childNodes).filter); // function
  ```
  > - DOM collections are read-only.
  > - DOM collections are live (current state of DOM).
  > - Don't use `for..in` to loop over collections.

## Siblings and the parent

_Siblings_ are nodes that are children of the same parent. For instance, `<head>` and `<body>` are
siblings:

- `<body>` is said to be the "next" or "right" sibling of `<head>`
- `<head>` is said to be the "previous" or "left" sibling of `<body>`
  The next sibling is in `nextSibling` property, and the previous one - in `previousSibling`. The parent
  is available as `parentNode`.

```js
alert(document.body.parentNode === document.documentElement); // true
alert(document.head.nextSibling); // HTMLBodyElement
alert(document.body.previousSibling); // HTMLHeadElement
```

## Element-only navigation

Navigation properties listed above refer to all nodes. But for many tasks we don't want text or comment
nodes. We want to manipulate element nodes that represents tags and form the structure of the page.

So let's see more navigation links that only take _element nodes_ into account:

[image]
  src: /img/js/walking-the-dom-1.webp
  alt: Element nodes

The links are similar to those given above, just with `Element` word inside:

- `children` - only those children that are element nodes.
- `firstElementChild`, `lastElementChild` - first and last element children.
- `previousElementSibling`, `nextElementSibling` - neighbor elements.
- `parentElement` - parent element.

## More links: tables

The `<table>` element supports (in addition to the given above) these properties:

- `table.rows` - the collection of `<tr>` elements of the table.
- `table.caption/tHead/tFoot` - references to elements `<caption>`, `<thead>`, `<tfoot>`
- `table.tBodies` - the collection of `<tbody>` elements (can be many according to the standard, but
  there will alwas be at lest one - even if it is not in the source HTML, the browser will put it in the
  DOM).

`<thead>`, `<tfoot>`, `<tbody>` elements provide the `rows` property:

- `tbody.rows` - the collection of `<tr>` inside.

`<tr>`:

- `tr.cells` - the collection of `<td>` and `<th>` cells inside the given `<tr>`
- `tr.sectionRowIndex` - the position (index) of the given `<tr>` inside the enclosing
  `<thead>/<tbody>/<tfoot>`.
- `tr.rowIndex` - the number of the `<tr>` in the table as a whole (including all table rows).

`<td>` and `<th>`:

- `<td.cellIndex` - the number of the cell inside the enclosing `<tr>`.

## Searching: getElement\*, querySelector\*

- `document.getElementById` - If an element has the `id` attribute, we can get the element no matter
  where it is.
- `elem.querySelectorAll(css)` - Returns all elements inside `elem` matching the given CSS selector.
- `elem.querySelector(css)` - Returns the first element for the given CSS selector.
- `elem.matches(css)` - Checks if an `elem` matches the given CSS-selector. It returns `boolean`.
- `elem.closest(css)` - Looks for the nearest ancestor that matches the CSS-selector. The `elem` itself
  is also included in the search.
- `elem.getElementsByTagName(tag)` - Looks for elements with the given tag an returns the collection of
  them. The `tag` parameter can also be a star `"*"` for "any tags".
- `elem.getElementsByClassName(className)` - Returns elements that have the given CSS class.
- `document.getElementsByName(name)` returns elements with the given `name` attribute, document-wide. Very
  rarely used.
