---
unlisted: true
title: Objects
date: 2023-06-16
prev_article:
  path: /js/fundamental
  title: Fundamental
next_article:
  path: /js/advance-working-with-functions
  title: Advanced working with functions
---

# Objects: The Basics

## Objects

- `this`

  `this` in arrow function refers to `this` in surrounding the function

- Optional chaining `?.`

## Symbol type

- `Symbol()` Two symbols with the same description are not equal
- Hidden properties
  - In an object literal: need `[]`
  - Are skipped by `for...in`
- Global symbols
  - `Symbol.for("id")`
  - `Symbol.keyFor(sym)`

## Iterables

Make any object usable in a `for...of` loop

- `Symbol.iterator`

```js
funcName[Symbol.iterator] = () => {
  return {
    current: this.from,
    last: this.to

    next() {
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  }
}
```

- String is iterable
- Calling an iterator explicity

```js
let str = "Hello";

let iterator = str[Symbol.iterator]();

while (true) {
  let result = iterator.next();
  if (result.done) break;
  console.log(result.value);
}
```

- Iterables and array-likes
  Different, array-likes can be not iterable
- `Array.from`

```js
let arrayLike = {
  0: "hello",
  1: "world",
  length: 2,
};
let arr = Array.from(arrayLike);
console.log(arr);
```

## Object.keys, values, entries

`Object.keys`

```js
Object.keys(obj);
// Return [key1, key2,...]
```

`Object.values`

```js
Object.values(obj);
// Return [value1, value2, ...]
```

`Object.entries`

```js
Object.entries(obj);
// Return [[key1, value1], [key2, value1], ...]
```

`Object.fromEntries`

```js
const array = Object.entries(obj);
Object.fromEntries(array);
// Return the object from array
```

Transforming objects

```js
let originalObj = Object.fromEntries(
    Object.entries(initialObj).map(entry => [entry[0], entry[1]]);
);
```

## Destructuring assignment

Array destructuring

```js
let arr = ["Khoa", "Tu"];
let [word1, word2] = arr; // word1 = "Khoa", word2 = "Tu"
```

The rest `...`

```js
let [word1, word2, ...rest] = []; // rest is a new array of the rest element
```

Default values

```js
let [name = "Guest", surname = "Anonymous"] = ["Julius"];
// name="Julius" (from array)
// surname="Anonymous" (default used)
```

Object destructuring

```js
let { field1, field2 } = obj;
let { field1: f1, field2: f2 } = obj;
let { value1 = val1, value2 = val2, field } = obj;
let { field1, ...rest } = obj;
```

Nested destructuring

```js
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: [1, 2],
  extrat: true
};

// Destructuring
let {
  size: {
    width,
    height
  },
  items: [item1, item2],
  title: "Menu" // not present in the object
} = options;
```

## Date and time

- Date before 01/01/1970 has negative timestamp
- Autocorrection
- Benchmarking:
  `date1.getTime()-date2.getTime()` is faster than `date1-date2`
- Date.parse from a string:
  - The string format should be: `YYYY-MM-DDTHH:mm:ss.sssZ`
  - Shorter variants are also possible: `YYYY-MM-DD`, `YYYY-MM`, `YYYY`

## JSON methods, toJSON

- `JSON.stringify`: to string
- `JSON.parse`: to object
- JSON supports following data types:
  - Objects
  - Arrays
  - Primitives:
    - strings
    - numbers
    - boolean
    - null
- JSON skips some object properties:
  - Function
  - Symbolic keys and values
  - Properties that store `undefined`
- Limitation: there must be no circular references

```js
let room = {};
let meetup = {};
meetup.place = room; // meetup references room
room.occupiedBy = meetup; // roon references meetup
JSON.stringify(meetup); // Error
```

- Full syntax

```js
let json = JSON.stringify(value[, replacer, space])
```

- Excluding and transforming: replacer

```js
function replacer(key, value) {
  console.log(`${key}: ${value}`);
  return key === "a_field_we_want_to_exclude" ? undefined : value;
}
```

- Formatting: space

```js
JSON.strignify(user, null, 2); // format 2 space
```

- Custom `toJSON()` method
- `JSON.parse`

```js
JSON.parse(str, [reviver]);
```

- Using reviver

```js
JSON.parse(str, function (key, value) {
  // A date string may not be a Date object so we have to
  // update it to a Date object
  if (key == "date") return new Date(value);
  return value;
});
```

## Object properties configuration

### Property flags and descriptors

`Propety flags`

Object properties, besides a `value`, have three special attributes:

- `writable`
- `enumerable`
- `configurable`

Method `Object.getOwnPropertyDescriptor` allows to query the full
information about a property

```js
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```

To change the flags, we can use `Object.defindProperty`

```js
Object.defineProperty(obj, propertyName, descriptor);
Object.defineProperty(user, "name", {
  value: "John",
});
```

`Object.defineProperties` help an object to define multiple properties

```js
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2,
  // ...
});
```
