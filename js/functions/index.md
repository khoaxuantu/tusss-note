---
unlisted: true
title: Advance Working with Functions
date: 2023-06-16
include:
  - components/block/note
prev_article:
  path: /js/objects
  title: Objects
next_article:
  path: /js/prototypes-inheritances
  title: Prototypes, inheritances
---

# Advanced Working With Functions

## Rest parameters and spread syntax

- Rest parameters `...`

```js
function f(...args) {} // args is the name of the array -> parameters array
```

[block.note]
  The rest parameters must be at the end

- The `arguments` variable

  A special array-like object that contains all arguments by their index

```js
function f() {
  console.log(arguments[0]);
  console.log(arguments[1]);
}

f(1, 2); // Show 1, 2
f(1); // Show 1, undefined (no second argument)
```

[block.note]
  Arrow functions do not have `arguments`

- Spread syntax

```js
let arr = [1, 2, 3];
Math.max(...arr); // 3

let arr1 = [2, 3, 4];
Math.max(...arr, ...arr1); // 4
Math.max(...arr, 5, ...arr1, 6); // 6
```

[block.note]
  The spread syntax internally uses iterators to gather elements,
  the same way as `for...of` does. So it can be used with any iterable.

- Copy an array/object

```js
let arr = [1, 2, 3];
let arrCopy = [...arr]; // Spread the array into a list of parameters
// then put the result into a new array
console.log(arr === arrCopy); // false
```

```js
let obj = { a: 1, b: 2, c: 3 };
let objCopy = { ...obj };

console.log(obj === objCopy); // false
console.log(JSON.stringify(obj) === JSON.stringify(objCopy)); // true
```

</details><br></br>

## The old `var`

- `var` has no block scope

```js
if (true) {
  var test = true;
}
console.log(test); // true
```

- `var` tolerates redeclarations

```js
var user = "Tus";
var user = "Tu";
// Works fine
```

- `var` variables can be declared below their use

```js
function sayHi() {
  phrase = "Hello";
  console.log(phrase);
  var phrase;
}
```

[block.note]
  Declarations are hoisted, but assignments are not

- IIFE\
  In the past, as there was only `var`, and it has no block-level
  visibility, programmers invented a way to emulate it. What they did
  was called "immediately-invoked function expressions" (IIFE).

```js
(function () {
  alert("Parentheses around the function");
})();

(function () {
  alert("Parentheses around the whole thing");
})();

!(function () {
  alert("Bitwise NOT operator starts the expression");
})();

+(function () {
  alert("Unary plus starts the expression");
})();
```

## Global object

```js
window.globalObj = {};
```

## The `new Function` syntax

Useful when creating function from string is needed

```js
let func = new Function([arg1, arg2, ...argN], functionBody);
```

## Scheduling: `setTimeout` and `setInterval`

- `setTimeout`

```js
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...);
```

- Canceling with `clearTimeout`

```js
let timerId = setTimeout(...);
clearTimeout(timerId);
```

- `setInterval`

```js
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

- Canceling with `TimerId`

```js
let timerId = setInterval(() => alert("clicl"), 2000);
setTimeout(() => {
  clearInterval(timerId);
  alert("stop");
}, 5000);
```

- Nested `setTimeout`

```js
/** instead of
 * let timerId = setInterval(() => alert('tick'), 2000);
 **/

let timerId = setTimeout(function tick() {
  alert("tick");
  timerId = setTimeout(tick, 2000);
}, 2000);
```

- Zero delay `setTimeout`\
  This schedules the execution of `func` as soon as possible. But the
  scheduler will invoke it only after ther currently executing script
  is complete.

```js
setTimeout(() => alert("World"));

alert("hello");
```

## Decorators and forwarding, call/apply

### Transparent caching

Let's say we have a function `slow(x)` which is CPU-heavy, but its
results are stable. In other words, for the same `x` it always return
the same result.

If the function is called often, we may want to cache (remember) the
results to avoid spending extra-time on recalculations.

Instead of adding that functionality into `slow()` we'll create a
wrapper function, that adds caching

```js
function slow(x) {
  // there can be a heavy CPU-intensive job here
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function (x) {
    if (cache.has(x)) {
      // if there's such key in cache
      return cache.get(x); // read the result from it
    }

    let result = func(x); // otherwise call func

    cache.set(x, result); // and cache (remember) the result
    return result;
  };
}

slow = cachingDecorator(slow);

alert(slow(1)); // slow(1) is cached and the result returned
alert("Again: " + slow(1)); // slow(1) result returned from cache
```

### Using `func.call` for the context

The caching decorator mentioned above is not suited to work with
object methods.

For instance, in the code below `worker.slow()` stops working after
the decoration:

```js
// we'll make worker.slow caching
let worker = {
  someMethod() {
    return 1;
  }

  slow(x) {
    // scary CPU-heavy task here
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
}

// same code as before
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) return cache.get(x);
    let result = func(x); // (**)
    cache.set(x, result);
    return result;
  };
}

alert( worker.slow(1) ); // the original method works

worker.slow = cachingDecorator(worker.slow); // now make it caching

alert( worker.slow(2) ); // Error: Canor read property 'someMethod` of undefined
```

The error occurs in the line `(*)` that tries to access `this.someMethod`
and fails.

The reason is that the wrapper calls the original function as `func(x)`
in the line `(**)`. And, when called like that, the function gets
`this = undefined`.

**Let's fix it.** There's a special built-in function method
`func.call(context, ...args)` that allows to call a funciton explicitly
setting `this`.

```js
func.call(context, arg1, arg2, ...)

// These 2 calls do almost the same
func(1, 2, 3);
func.call(obj, 1, 2, 3);
```

```js
function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// use call to pass different objects as "this"
sayHi.call(user);
sayHi.call(admin);
```

In our case, we can `call` in the wrapper to pass the context to
the original function:

```js
// before: let result = func(x);
let result = func.call(this, x);
```

### Going multi-argument

Till now the `cachingDecorator` was working only with single-argument
functions. Now how to cache the multi-argument `worker.slow` method?

```js
let worker = {
  slow(min, max) {
    return min + max; // scary CPU-hogger is assumed
  },
};

// cachingDecorator needs modifying
function cachingDecorator(func, hash) {
  let cache = new Map();
  return function () {
    let key = hash(arguments); // (*)
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.call(this, ...arguments); // (**)

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + "," + args[1];
}

// should remember same-argument calls
worker.slow = cachingDecorator(worker.slow, hash);

alert(worker.slow(3, 5)); // works
alert("Again " + worker.slow(3, 5)); // same (cached)
```

### `func.apply`

Instead of `func.call(this, ...arguments)` we could use
`func.apply(this, arguments)`.

```js
func.apply(context, args);
```

These two calls are almost equivalent:

```js
func.call(context, ...args);
func.apply(context, args);
```

## Function binding

- Losing `this`

```js
let user = {
  firstname: "John";
  sayHi() {
    alert(`Hello, ${this.firstname}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!
```

- Solution 1: a wrapper

```js
let user = {
  firstname: "John";
  sayHi() {
    alert(`Hello, ${this.firstname}!`);
  }
};

setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
```

- Solution 2: bind

```js
let boundFunc = func.bind(context);
```

```js
let user = {
  firstname: "John";
};

function func() {
  alert(this.firstName);
}

let funcUser = func.bind(usert);
funcUser(); // John
```

- Partial functions

  The full syntax of `bind`:

```js
let bound = func.bind(context, [arg1], [arg2], ...);
```

```js
function mul(a, b) {
  return a * b;
}

let double = mul.bind(null, 2);

alert(double(3)); // = mul(2, 3) = 6
```

- Going partial without context

  What if we'd like to fix some arguments, but not the context `this`?
  The native `bind` does not allow that.

```js
function partial(func, ...argsBound) {
  return function (...args) {
    return func.call(this, ...argsBound, ...args);
  };
}

// Usage
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  },
};

// add a partial method with fixed time
user.sayNow = partial(user.say, new Date().getHours() + ":" + new Date().getMinutes());

user.sayNow("Hello");
// [10:00] John: Hello!
```
