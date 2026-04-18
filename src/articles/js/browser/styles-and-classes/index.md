---
unlisted: true
title: Styles & Classes
date: 2023-09-03
prev_article:
  path: /js/browser/modifying-the-document
  title: Modifying the document
next_article:
  path: /js/browser/element-sizes-and-scrolling
  title: Element sizes & scrolling
---

# Styles & Classes

There are generally 2 ways to style an element:

1. Create a class in CSS and add it: `<div class="...">`
2. Write properties directly into `style`: `<div style="...">`

JavaScript can modify both classes and `style` properties.

```javascript
let top = "complex calculations";
let left = "complex calculations";

elem.style.top = top;
elem.style.left = left;
```

## className and classList

The `elem.className` corresponds to the `"class"` attribute

```html
<body class="main page">
  <script>
    alert(document.body.className); // main page
  </script>
</body>
```

Methods of `classList`:

```javascript
elem.classList.add("class"); // Adds the class
elem.classList.remove("class"); // Removes the class
elem.classList.toggle("class"); // Adds the class if it doesn't exist, otherwise reomves it
elem.classList.contains("class"); // checks for the given class, returns boolean
```

## Element style

The property `elem.style` is an object that corresponds to what's written in the `"style"` attribute.

```
width => elem.style.width

background-color  => elem.style.backgroundColor
z-index           => elem.style.zIndex
border-left-width => elem.style.borderLeftWidth
```

## Resetting the style property

`elem.style.removeProperty('style property)`: Remove a property of style

## Mind the units

```javascript
document.body.style.margin = 20; // doesn't work
document.body.style.margin = "20px"; // Add the CSS unit and it works
```

## Computed styles: getComputedStyle

> The `style` property operates only on the value of the `"style"` attribute, without CSS cascade.

So we can't read anything that comes from CSS classes using `elem.style`

There is another method for that: `getComputedStyle`.

```javascript
getComputedStyle(element, [pseudo]);
```

```javascript
let computedStyle = getComputedStyle(document.body);
alert(computedStyle.marginTop);
alert(computedStyle.color);
```
