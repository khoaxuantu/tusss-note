---
unlisted: true
title: Modifying the Document
date: 2023-09-03
prev_article:
  path: /js/browser/attributes
  title: Attributes & properties
next_article:
  path: /js/browser/styles-and-classes
  title: Styles & Classes
---

# Modifying The Document

## Creating an element

`document.createElement(tag)`

```javascript
let div = document.createElement("div");
```

`document.createTextNode(text)`

```javascript
let textNode = document.createTextNode("Lmao");
```

## Insertion method

```javascript
document.body.append(div);
```

- `node.append(...nodes or strings)`: append nodes or strings _at the end_ of
  `node`.
- `node.prepend(...nodes or strings)`: insert nodes or strings _at the beginning_ of `node`.
- `node.before(...nodes or strings)`: insert nodes or strings _before_ `node`.
- `node.after(...nodes or strings)`: insert nodes or strings _after_ `node`.
- `node.replaceWith(...nodes or strings)`: replaces `node` with the given
  nodes or strings.

## insertAdjacentHTML / Text / Element

`elem.insertAdjacentHTML(where, html)`

The first parameter is a code word, specifying where to insert relative to
`elem`. Must be one of the following:

- `"beforebegin"`: insert `html` immediately before `elem`.
- `"afterbegin"`: insert `html` into `elem`, at the beginning.
- `"beforeend"`: insert `html` into `elem`, at the end.
- `"afterend"`: insert `html` immediately after `elem`.

The method has 2 brothers:

- `elem.insertAdjacentText(where, text)`: the same syntax, but a string of text
  is inserted "as text" instead of HTML.
- `elem.insertAdjacentElement(where, elem)`: the same syntax, but inserts an
  element.

## Node removal

```js
elem.remove();
```

> All insertion methods automatically remove the node from the old place

## Cloning nodes: cloneNode

The call `elem.cloneNode(true)` creates a "deep" clone of the element - with all attributes and
subelements. If we call `elem.cloneNode(false)`, then the clone is made without child elements.

```javascript
let div2 = div.cloneNode(true); // clone the existing div
div2.querySelector("b").innerHTML = "Bye there!"; // change the clone

div.after(div2); // show the clone after the existing div
```

## DocumentFragment

`DocumentFragment` is a special DOM node that servers as a wrapper to pass around lists of nodes. We canappend other nodes to it, but when we insert it somewhere, then its content is inserted instead.

```html
<ul id="ul"></ul>

<script>
  function getListContent() {
    let fragment = new DocumentFragment();

    for (let i = 1; i <= 3; i++) {
      let li = document.createElement("li");
      li.append(i);
      fragment.append(li);
    }

    return fragment;
  }

  ul.append(getListContent()); // (*)
</script>
```

At the last line `(*)` we append `DocumentFragment`, but it "blends in", so the resulting structure will be:

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

> `DocumentFragment` is rarely used explicitly. We mention it mainly because there are some concepts on
> top of it, like [template](#template-element) element, that we'll cover much later.
