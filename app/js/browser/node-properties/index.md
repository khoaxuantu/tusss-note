---
unlisted: true
title: Node Properties
date: 2023-09-03
include:
  - components/block/note
prev_article:
  path: /js/browser/walking-the-dom
  title: Walking the DOM
next_article:
  path: /js/browser/attributes
  title: Attributes & properties
---

# Node Properties

## DOM node classes

Different DOM nodes may have different properties. For instance, an element node corresponding to tag
`<a>` has a link-related properties, and the one corresponding to `<input>` has input-related properties
and so on.

Each DOM node belongs to the corresponding built-in class. The root of the hierarchy is
[EventTarget](https://dom.spec.whatwg.org/#eventtarget), that is inherited by [Node](https://dom.spec.whatwg.org/#interface-node),
and other DOM nodes inherit from it.

[image]
  src: /img/js/node-properties.webp
  alt: DOM node classes

[block.note]
  To see the DOM node class name, we can recall that an object ususally has the `constructor` property.
  It references the class constructor, and `constructor.name` is its name:

  ```js
  alert(document.body.constructor.name); // HTMLBodyElement
  ```

## The "nodeType" property

The `nodeType` property provides one more, "old-fashioned" way to get the "type" of a DOM node.

It has a numeric value:

- `elem.nodeType == 1` for element nodes,
- `elem.nodeType == 3` for text nodes,
- `elem.nodeType == 9` for the document object,
- There are few other values in [the specification](https://dom.spec.whatwg.org/#node)

In modern scripts, we can use `instanceof` and other class-based tests to see the node type, but sometimes
`nodeType` may be simpler.

## Tag: nodeName and tagName

Given a DOM node, we can read its tag name from `nodeName` or `tagName` properties:

```js
alert(document.body.nodeName); // BODY
alert(document.body.tagName); // BODY
```

Differences between `tagName` and `nodeName`:

- the `tagName` property exists only for `Element` nodes.
- the `nodeName` is defined for any `Node`:
  - For elements it means the same as `tagName`.
  - For other node types (text, comment, etc...) it has a string with the node type.

## innerHTML: the contents

The [innerHTML](https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin) property allows to get the HTML
inside the element as a string.

### Beware: "innerHTML +=" does a full overwrite

We can append HTML like this

```js
elem.innerHTML += "<div>Hello<img src='smile.gif'/> !</div>";
elem.innerHTML += "How goes?";
```

But we should be very careful about doing it, because what's going on is _not_ an addition, but a full
overwrite. Technically, these 2 lines do the same:

```js
elem.innerHTML += "...";
elem.innerHTML = elem.innerHTML + "...";
```

1. The old contents is removed
2. The new `innerHTML` is written instead (a concatenation of the old and the new one).

> As the content is "zeroed-out" and rewritten from the scratch, all images and other resources will
> be reloaded.

## outerHTML: full HTML of the element

The `outerHTML` property contains the full HTML of the element. That's like `innerHTML` plus the element
itself.

```html
<div id="elem">Hello <b>World</b></div>

<script>
  alert(elem.outerHTML);
  // element id 'elem'
</script>
```

[block.note]
  Unlike `innerHTML`, writing to `outerHTML` does not change the element. Instead, it replaces it in the
  DOM

  ```html
  <div>Hello, world!</div>

  <script>
    let div = document.querySelector("div");

    // replace div.outerHTML with <p>...</p>
    div.outerHTML = "<p>A new element</p>";

    // The 'div' still the same
    alert(div.outerHTML); // <div>Hello, world!</div>
  </script>
  ```

  What happened in `div.outerHTML=...` is:

  - `div` was removed from the document.
  - Another piece of HTML `<p>A new element</p>` was inserted in its place.
  - `div` still has its old value. The new HTML wasn't saved to any variable.

## nodeValue/data: text node content

The `innerHTML` property is only valid for element nodes.

Other node types, such as text nodes, have their counterpart: `nodeValue` and `data` properties.
These two are almost the same for practical use, there are only minor specification differences.

```html
<body>
  Hello
  <!-- Comment -->
  <script>
    let text = document.body.firstChild;
    alert(text.data); // Hello

    let comment = text.nextSibling;
    alert(comment.data); // Comment
  </script>
</body>
```

## textContent: pure text

The `textContent` provides access to the _text_ inside the element: only text, minus all `<tags>`

```html
<div id="news">
  <h1>Headline!</h1>
  <p>Martians attack people!</p>
</div>

<script>
  // Headline! Martians attack people!
  alert(news.textContent);
</script>
```

> Writing to `textContent` is much more useful, because it allows to write text the "safe way"

## The "hidden" property

The "hidden" attribute and the DOM property specifies whether the element is visible or not

```html
<div>Both divs below are hidden</div>

<div hidden>With the attribute "hidden"</div>

<div id="elem">JavaScript assigned the property "hidden"</div>

<script>
  elem.hidden = true;
</script>
```

## More properties

- `value` - the value for `<input>`, `<select>` and `<textarea>` (`HTMLInputElement`, `HTMLSelectElement`...)
- `href` - the "href" for `<a href="...">` (`HTMLAnchorElement`)
- `id` - the value of "id" attribute, for all elements (`HTMLElment`)
- ...and much more...
