---
unlisted: true
title: Classes
date: 2023-06-16
prev_article:
  path: /js/prototypes-inheritances
  title: Prototypes, inheritances
next_article:
  path: /js/errors-handling
  title: Errors handling
---

# Classes

In JavaScript, a class is a kind of function.

What `class A{...}` construct really does is:

1. Creates a function named `A`, that becomes the result of the class
   declaration. The function code is taken from the `constructor` method.
2. Stores class methods in `A.prototype`

**Basic syntax**

```js
class MyClass {
  prop = value; // property

  constructor(...) { // constructor
    // ...
  }

  method(...) {} // method

  get something(...) {} // getter method
  set something(...) {} // setter method

  [Symbol.iterator]() {} // method with computed name (symbol here)
  // ...
}
```
