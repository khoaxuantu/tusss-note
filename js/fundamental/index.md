---
unlisted: true
title: Fundamental
date: 2023-06-16
prev_article:
  path: /js
  title: Introduction
next_article:
  path: /js/objects
  title: Objects
---

# Fundamental

## Variables

```js
var x = 1; // Too old...
const y = 3;
let z = 2;
```

### `let`

To create a variable, use the `let` keyword.

```js
let message;
message = "Hello"; // store the string 'Hello' in the variable named message
```

### `const`

To declare a constant (unchanging) variable, use `const` instead of
`let`:

```js
const myBirthday = "29.08.2000";

myBirthday = "15.02.2004"; // error, can't reassign the constant!
```

For the object constant variable, we still can reassign its fields,
but not the whole object itself.

```js
const obj = {
  name: "Tu",
};

obj.name = "Tuslipid"; // name: Tuslipid
obj = {
  name: "Tusss",
}; // error, can't reassign the constant!
```

### `var`

In older scripts, you may also find another keyword: `var` instead of
`let`:

```js
var message = "Hello";
```

The `var` keyword is _almost_ the same as `let`. It also decalares
variable, but in a slightly different, "old-school" way.

There are subtle differences between `let` and `var`, learn more at
[The old "var"](#the-old-var).

> It is recommended to use `const`, `let` instead of `var`.

## Data types

`NaN`, `null` and `undefined`

- `NaN`\
  A computational error. It is a result of an incorrect or and undefined
  mathematical operation.\
  `NaN` is sticky. Any further mathematical operation on `NaN` returns
  `NaN`.

```js
alert("not a number" / 2); // NaN, such division is erroneous

alert(NaN + 1); // NaN
```

- `null`\
  In JavaScript, `null` is not a "reference to a non-existing object"
  or a "null pointer" like in some other languages.\
  It's just a speical value shich represents "nothing", "empty" or
  "value unknown".

```js
let age = null; // age is unknown
```

- `undefined`\
  The meaning of `undefined` is "value is not assigned".\
  If a variable is declared, but not assigned, then its value is
  `undefined`:

```js
let age;
alert(age); // undefined
```

## Interaction

- alert
- prompt
- confirm

## Comparisons

`==` vs `===`

A strict equality operator `===` checks the equality without type
conversion. In other words, if `a` and `b` are different types, then `a === b`
immediately returns `false` without an attempt to convert them.

In `a == b`, if the type of `a` is different from `b`, `b` needs
converting to the same type of `a` then check the equality.

```js
0 == false; // true
0 === false; // false
```

## Logical operators

`! (NOT)`

The boolean NOT operator accepts a single argument and does the
following:

1. Converts the operand to boolean type: `true/false`.
2. Returns the inverse value. `true/false` -> `false/true`

```js
// The boolean value of all variables except 0, false, null, undefined are TRUE.
!true; // false
!"non-empty string"; // false
![1, 2, 3]; // false
!!"non-empty string"; // true

!0; // true
!null; // true
!undefined; // true
!false; // true
```

> !a does not mean `a != null` or `a !== null && a !== undefined`.

## Nullish coalescing operator `??`

`??` returns the first arguments if it's not `null/undefined`. Otherwise,
the second one.

```js
result = a ?? b;

// same as
result = a != null ? a : b;
```

Comparison with `||`:

- `||` returns the first _truthy_ value. `||` doesn't distinguish
  between `false`, `0`, and empty string `""` and `null/undefined`.
- `??` returns the first _defined_ value.

```js
let height = 0;
alert(height || 100); // 100
alert(height ?? 100); // 0
```

## Loop `for`

- `for` (basic)
- `forEach`

```js
array.forEach((element) => element);
```

- `for...in`

```js
for (const key in obj) {
  if (Object.hasOwnProperties(key)) {
    const element = obj[key];
  }
}
```

- `for...of`

```js
for (const iterator of obj) {
  const value = iterator;
}
```

## Functions

Function declaration:

```js
function func() {}
```

Function expression:

```js
const func = function () {};
```

Arrow function:

```js
const func = () => {};
```

## Code quality

### Polyfills and transpilers

#### Polyfills

The scripts that update/add new functions.

#### Transpilers

Translate code to a different version.
