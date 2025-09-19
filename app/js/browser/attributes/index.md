---
unlisted: true
title: Attributes and Properties
date: 2023-09-03
prev_article:
  path: /js/browser/node-properties
  title: Node properties
next_article:
  path: /js/browser/modifying-the-document
  title: Modifying the document
---

# Attributes And Properties

## DOM properties

There are a lot of built-in DOM properties, but technically no one limits us, and if there aren't
enough, we can add our own.

```javascript
document.body.myData = {
  name: "Caesar",
  title: "Imperator",
};

alert(document.body.myData.title); // Imperator

document.body.sayTagName = function () {
  alert(this.tagName);
};

document.body.sayTagName(); // BODY (the value of "this" in the method is document.body)
```

We can also modify built-in prototypes like `Element.prototype` and add new methods to all elements:

```js
Element.prototype.sayHi = function () {
  alert(`Hello, I'm ${this.tagName}`);
};
document.documentElement.sayHi(); // Hello, I'm HTML
document.body.sayHi(); // Hello, I'm BODY
```

## HTML attributes

```html
<body id="test">
  <script>
    alert(document.body.id); // test
  </script>
</body>
```

All attributes are accessible by using the following mthods:

- `elem.hasAttribute(name)` - checks for existence
- `elem.getAttribute(name)` - gets the value
- `elem.setAttribute(name, value)` - sets the value
- `elem.removeAttribute(name)` - removes the attribute

> - Attribute names are case-insensitive
> - We can assign anything to an attribute, but it becomes a string
> - All attributes are visible in `outerHTML`
> - The `attributes` collection is iterable and has all the attributes of the element (standard and
>   non-standard) as objects with `name` and `value` properties

## Property-attribute synchronization

When a standard attribute changes, the corresponding property is auto-updated, and (with some exception)
vice versa.

```html
<input />

<script>
  let input = document.querySelector("input");

  // attribute -> property
  input.setAttribute("id", "id");
  alert(input.id); // id (updated)

  // property -> attribute
  input.id = "newId";
  alert(input.getAttribute("id")); // newId (updated)
</script>
```

But there are exclusions, for instance `input.value` synchronizes only from attribute -> property, but
not back:

```js
// attribute => property
input.setAttribute("value", "text");
alert(input.value); // text

// NOT property => attribute
input.value = "newValue";
alert(input.getAttribute("value")); // text (not updated)
```

## DOM properties are typed

- DOM properties are not always strings.
- For instace, the `input.checked` property (for checkboxes) is a boolean
- The `style` attribute is a string, but the `style` property is an object
- The `href` DOM property is always a _full_ URL, even if the attribute contains a relative URL or just
  a `#hash`

```html
<a id="a" href="#hello">link</a>
<script>
  // attribute
  alert(a.getAttribute('href')); // #hello

  //property
  alert(a.href); // full URL in the form https://example.com/page#hello
```

## Non-standard attributes, dataset

Sometimes non-standard attributes are used to pass custom data from HTML to JavaScript, or to "mark"
HTML-elements for JavaScript

```html
<!-- mark the div to show "name" here -->
<div show-info="name"></div>
<!-- and age here -->
<div show-info="age"></div>

<script>
  // the code finds an element with the mark and shows what's requested
  let user = {
    name: "Peter",
    age: 25,
  };

  for (let div of document.querySelectorAll("[show-info]")) {
    // insert the corresponding info into the field
    let field = div.getAttribute("show-info");
    div.innerHTML = user[field]; // first Pete into "name", then 25 into "age"
  }
</script>
```

Also they can be used to style an element.

```html
<style>
  /* style rely on the custom attribute "order-state" */
  .order[order-state="new"] {
    color: green;
  }
  .order[order-state="pending"] {
    color: blue;
  }
  .order[order-state="canceled"] {
    color: red;
  }
</style>

<div class="order" order-state="new">A new order.</div>

<div class="order" order-state="pending">A pending order.</div>

<div class="order" order-state="canceled">A canceled order.</div>
```

To avoid conflicts in development, there exist [data-\*](https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes)
attributes.

> All attributes starting with "data-" are reserved for programmers' use. They are available in the
> `dataset` property

```html
<body data-about="Elephants">
  <script>
    alert(document.body.dataset.about); // Elephants
  </script>
</body>
```
