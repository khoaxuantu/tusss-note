---
unlisted: true
title: DOM Tree
date: 2023-09-03
include:
  - components/block/note
prev_article:
  path: /js/browser/browser-environment
  title: Browser Environment Specifications
next_article:
  path: /js/browser/walking-the-dom
  title: Walking the DOM
---

# DOM Tree

The backbone of an HTML document is tags.

According to the DOM, every HTML tag is an object. Nested tags are "children" of the enclosing one. The
text inside a tag is an object as well.

All these objects are accessible using JavaScript, and we can use them to modify the page.

```js
document.body.style.background = "red";

setTimeout(() => (document.body.style.background = ""), 3000);
```

## An example of the DOM

```html
<!DOCTYPE html>
<html>
  <head>
    <title>About Tus</title>
  </head>
  <body>
    Something about Tusss...
  </body>
</html>
```

The DOM represents HTML as a tree structure of tags. Here's how it looks:

```html
<html>
  |--- <head>
  |       |--- text
  |       |--- <title>
  |       |         |--- text "About Tus"
  |
  |--- text
  |
  |--- <body>
  |      |--- text "Something about Tusss..."
```

## Autocorrection

If the browser encounters malformed HTML, it automatically corrects it when making the DOM.

For instance, the top tag is always `<html>`. Even if it doesn't exist in the document, it will exists in
the DOM, because the browser will create it. The same goes for `<body>`.

As an example, if the HTML file is the single word `"Hello"`, the browser will wrap it into `<html>` and
`<body>`, and add the required `<head>`, and the DOM will be:

```html
<html>
  |---
  <head>
    | |---
    <body>
      | |--- text "Hello"
    </body>
  </head>
</html>
```

[block.note]
  An interesting "special case" is tables. by DOM specification they must have `<tbody>` tag, but HTML
  text may omit it. Then the browser creates `<tbody>` in the DOM automatically

  ```html
  <table id="table">
    <tr>
      <td>1</td>
    </tr>
  </table>
  ```

  ```html
  <table>
    |---
    <tbody>
      | |---
      <tr>
        | | |---
        <td>| | | |--- text "1"</td>
      </tr>
    </tbody>
  </table>
  ```

## Other node types

There are [12 node types](https://dom.spec.whatwg.org/#node). In practice we usually work 4 of them:

- `document` - the "entry point" into DOM
- element nodes - HTML tags, the tree building blocks
- text nodes - contain text
- comments - sometimes we can put information here, it won't be shown, but JS can read it from the DOM
