---
unlisted: true
title: Prototypes, inheritances
date: 2023-06-16
include:
  - components/block/note
prev_article:
  path: /js/functions
  title: Advanced working with functions
next_article:
  path: /js/classes
  title: Classes
---

# Prototypes, Inheritances

## Prototypal inheritance

`[[Prototype]]`

```js
let animal = {
  eats: true,
};

let rabbit = {
  jumps: true,
};

rabbit.__proto__ = animal;

console.log(rabbit.eats); // true
console.log(rabbit.jumps); // true
```

[block.note]
  The `__proto__` must be an object or null

## F.prototype

Used when a object is created by a constructor function, like `new F()`

```js
let animal = {
  eats: true,
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

let rabbit = new Rabbit("White Rabbit"); // When a new Rabbit is created,
// assign its [[Prototype]] to animal

console.log(rabbit.eats); // true
```

- Default F.prototype, constructor property

```js
function Rabbit() {}

/* default prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

## Native prototypes

- `Object.prototype`

```js
let obj = {};

console.log(obj.__proto__ === Object.prototype); // true

console.log(obj.toString === obj.__proto__.toString); // true
console.log(obj.toString === Object.prototype.toString); // true
```

[block.note]
  There is no more `[[Prototype]]` in the chain above `Object.prototype`

- Other built-in prototypes

  Other built-in objects such as `Array`, `Date`, `Function`, etc...
  also keep methods in prototypes

```js
let arr = [1, 2, 3];

console.log(arr.__proto__ === Array.prototype); // true

console.log(arr.__proto__.__proto__ === Object.prototype); // true

console.log(arr.__proto__.__proto__.__proto__); // null

console.log(arr); // 1,2,3 <-- the result of Array.prototype.toString
```

- Changing native prototypes

```js
// show becomes available to all strings
String.prototype.show = function () {
  alert(this);
};

"Boom!".show(); // Boom!
```

- Borrowing from prototypes

```js
let obj = {
  0: "Hello",
  1: "World!",
  length = 2,
};
obj.join = Array.prototype.join;
console.log(obj.join(',')); // Hello,World!
```
