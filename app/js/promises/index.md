---
unlisted: true
title: Promises
date: 2023-06-16
include:
  - components/block/note
prev_article:
  path: /js/errors-handling
  title: Errors Handling
next_article:
  path: /js/generators
  title: Generators, advanced iteration
---

# Promises, Async/await

## Introduction: callbacks

Many functions are provided by JavaScript host environments that allow
you to schedule _asynchronous_ actions. In other words, actions that
we initiate now, but they finish later.

```js
function loadScript(src) {
  // creates a `script` tag and append it to the page
  // this causes the script with given src to start loading and run
  // when complete
  let script = document.createElement("script");
  script.src = src;
  document.head.append(script);
}

// load and execute the script at the given path
loadScript("/my/script.js"); // the script has "function newFunction() {}"
// the code below loadScript doesn't wait for the script loading to finish
newFunction(); // no such function!
```

Let's add a `callback` function as a second argument to `loadScript`
that should execute when the script loads:

```js
function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;

  script.onload = () => callback(script);

  document.head.append(script);
}

loadScript("/my/script.js", function () {
  // the callback runs after the script is loaded
  newFunction(); // so now it works
  ...
});
```

### Callback in callback

How can we load two scripts sequentially: the first one, and then the
second one after it?

The natural solution would be to put the second `loadScript` call
inside the callback

```js
loadScript("/my/script.js", function (script) {
  alert(`Cool, the ${script.src} is loaded, let's load one more`);

  loadScript("/my/script2.js", function (script) {
    alert(`Cool, the second script is loaded`);
  });
});
```

After the outer `loadScript` is complete, the callback initiates the
inner one.

What if we want one more script...?

```js
loadScript("/my/script.js", function (script) {
  loadScript("/my/script2.js", function (script) {
    loadScript("/my/script3.js", function (script) {
      // ... continue after all scripts are loaded
    });
  });
});
```

### Handling errors

Here's an improved version of `loadScript` that tracks loading errors

```js
function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}

// The usage
loadScript("/my/script.js", function (err, script) {
  if (error) {
    // handle error
  } else {
    // script loaded successfully
  }
});
```

### Pyramid of Doom

```js
loadScript("1.js", function (error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript("2.js", function (error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript("3.js", function (error, script) {
          if (error) {
            handleError(error);
          } else {
            // ...continue after all scripts are loaded
          }
        });
      }
    });
  }
});
```

Callbacks hell! We can try to alleviate the problem by making every
action a standalone function

```js
loadScript("1.js", step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript("2.js", step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript("3.js", step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...continue after all scripts are loaded
  }
}
```

## Promise

```js
let promise = new Promise(function (resolve, reject) {
  // executor
});
```

The `promise` object returned by the `new Promise` constructor has
these internal properties

- `state` - initially `"pending"`, then changes to either `"fulfilled"`
  when `resolve` is called or `"rejected"` when `reject` is called.
- `result` - initially `undefined`, then changes to `value` when
  `resolve(value)` is called or `error` when `reject(error)` is called.

[block.note]
  Only the first call of `resolve/reject` is taken into account.
  Further calls are ignored.

### Consumers: then, catch

`then`

```js
promise.then(
  function (result) {
    /* handle a successful result */
  },
  function (error) {
    /* handle an error */
  }
);
```

`catch` - if we interested only in errors

```js
promise.catch(errorHandlingFunction);
```

### Cleanup: finally

The call `.finally(f)` is similar to `.then(f, f)` in the sense that
`f` runs always, when the promise is settled: be it resolve or reject.

```js
new Promise((resolve, reject) => {
    /* do sth */
})
// runs when the promise is settled, doesn't matter successfully or not
.finally(() => stop loading indicator)
// so the loading indicator is always stopped before we go on
.then(result => show result, err => show error);
```

## Promise chaining

```js
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000);
})
  .then(function (result) {
    alert(result); // 1
    return result * 2;
  })
  .then(function (result) {
    alert(result); // 2
    return result * 2;
  })
  .then(function (result) {
    alert(result); // 4
    return result * 2;
  });
```

## Error handling with promises

```js
fetch("https://no-such-server.blabla") // rejects
  .then((response) => response.json())
  .catch((err) => alert(err)); // TypeError: failed to fetch
```

### Implicit try...catch

This code:

```js
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
}).catch(alert); // Error: Whoops!
```

...Works exactly the same as this:

```js
new Promise((resolve, reject) => {
  reject(new Error("Whoops!"));
}).catch(alert); // Error: Whoops!
```

The "invisible `try...catch`" around the executor automatically catches
the error and turns it into rejected promise.

### Rethrowing

In a promise we may analyze the error and rethrow it like a regular
`try...catch` if it can't be handled.

```js
// the execution: catch -> catch
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
})
  .catch(function (error) {
    if (error instanceof URIError) {
      // Handle it
    } else {
      alert("Can't handle such error");
      throw error; // Throwing this or another error jumps to the next catch
    }
  })
  .then(function () {
    /* Doesn't run here */
  })
  .catch((error) => {
    alert(`The unknown error has occured: ${error}`);
    // Don't return anything => execution goes the normal way
  });
```

## Promise API

### Promise.all

`Promise.all` takes an iterable (ususally, an array of promises) and
returns a new promise.

The new promise resolves when all listed promises are resolved, and
the array of their results becomes its result.

```js
let promise = Promise.all(iterable);
```

For instance, the `Promise.all` below settles after 3 seconds, and
then it result is an array `[1,2,3]`

```js
Promise.all([
  new Promise((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new Promise((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new Promise((resolve) => setTimeout(() => resolve(3), 1000)), // 3
]).then(alert); // 1,2,3 when promises are ready
```

[block.note]
  If one promise rejects, `Promise.all` immediately rejects,
  completely forgetting about the other ones in the list. Their result
  are ignored.

### Promise.allSettled

[block.note]
  This is a recent addition to the language. Old browsers may need polyfills.

For example, we'd like to fetch the information about multiple users.
Even if one request fails, we're still interested in the others.

```js
let urls = [
  "https://api.github.com/users/iliakan",
  "https://api.github.com/users/remy",
  "https://no-such-url",
];

Promise.allSettled(urls.map((url) => fetch(url))).then((results) => {
  // (*)
  results.forEach((result, num) => {
    if (result.status === "fulfilled") {
      alert(`${urls[num]}: ${result.value.status}`);
    }
    if (result.status === "rejected") {
      alert(`${urls[num]}: ${result.reason}`);
    }
  });
});
```

The `results` in the line `(*)` will be

```js
[
  {status: 'fulfilled', value: ...response...},
  {status: 'fulfilled', value: ...response...},
  {status: 'rejected', reason: ...error object...}
]
```

### Promise.race

Similar to `Promise.all`, but waits only for the first settled promise and gets its result (or error).

```js
let promise = Promise.race(iterable);
```

```js
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).then(alert); // 1
```

### Promise.any

Similar to `Promise.race`, but waits only for the first fulfilled
promise and gets it result. If all of the given promises are rejected,
the the returned promise is rejected with `AggregateError`.

```js
let promise = Promise.any(iterable);
```

```js
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).then(alert); // 1

// When all promises fail
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ouch!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Error!")), 2000)),
]).catch((error) => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors[0]); // Error: Ouch!
  console.log(error.errors[1]); // Error: Error!
});
```

### Promise.resolve/reject

- `Promise.resolve(value)` is same as `new Promise(resolve => resolve(value))`.
- `Promise.reject(value)` is same as `new Promise((resolve, reject) => reject(error))`.

## Promisification

"Promisification" is a long word for a simple transformation - the
conversion of a function that accepts a callback into a function that
returns a promise.

For instance, we have `loadScript(src, callback)` from
[Introduction: callbacks](#introduction-callbacks)

```js
function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}
```

We can promisify like this

```js
let loadScriptPromise = function(src) {
  return new Promise((resolve, reject) => {
    loadScript(src, (err, script) => {
      if (err) reject(err);
      else resolve(script);
    })
  })
}

// Usage
loadScriptPromise('path/script.js').then(...);
```

The new function is a wrapper arount the original `loadScript` function.
It calls it providng its own callback that translates to promise
`resolve/reject`.

In practice we may need to promisify more than one function, so it
makes sense to use a helper. We'll call it `promisify(f)`: it accepts
a to-promisify function `f` and returns a wrapper function.

```js
function promisify(f) {
  return function (...args) { // return a wrapper-function
    return new Promise((resolve, reject) => {
      function callback(err, result) { // our custom callback for f
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custon callback to the end of f arguments

      f.call(this, ...args); // call the original function
    });
  };
}

// Usage
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

Here, `promisify` assumes that the original function expects a callback
with exactly two arguments `(err, result)`. That's what we encounter
most often. Then our custom callback is in exactly the right format,
and `promisify` works great for such a case.

But what if the original `f` expects a callback with more arguments
`callback(err, res1, res2, ...)?

We can improve our helper. Let's make a more advanced version of
`promisify`.

- When called as `promisify(f)` it should work similar to the version
  above.
- When called as `promisify(f, true)`, it should return the promise
  that resolves with the array of callback results. That's exactly for
  callbacks with many arguments.

```js
// promisify(f, true) to get array of results
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) { // our custom callback for f
        if (err) {
          reject(err);
        } else {
          // resolve with all callback results if manyArgs is specified
          resolve(manyArgs ? results : results[0]);
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
}

// usage
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...);
```

[block.note]
  There are also modules with a bit more flexible promisification
  functions, e.g. [es6.promisify](https://github.com/digitaldesignlabs/es6-promisify).
  In Node.js, there's a built-in `util.promisify` function for that.

## Microtasks

```js
let promise = Promise.resolve();

promise.then(() => alert("promise done!"));

alert("code finished"); // this alert shows first
```

### Microtasks queue

As stated in the [specification](https://tc39.github.io/ecma262/#sec-jobs-and-job-queues):

- The queue is first-in-first-out: tasks enqueued first are run first.
- Execution of a task is initiated only when nothing else is running.

When a promise is ready, its `.then/catch/finally` handlers are put
into the queue, they are not executed yet. When the JavaScript engine
becomes free from the current code, it takes a task from the queue and executes it.

## Async/await

There's a special syntax to work with promises in a more comfortable
fashion, called "async/await". It's surprisingly easy to understand
and use.

### Async function

The word `async` before a function means one simple thing: a function
always returns a promise. Other values are wrapped in a resolved
promise automatically.

```js
async function f() {
  return 1;
}

f().then(alert); // 1
```

...We could explicity return a promise, which would be the same:

```js
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```

### Await

The keyword `await` makes JavaScript wait until the promise settles
and returns it result

> It works only inside async functions.

```js
let value = await promise;
```

Here's an example with a promise that resolves in 1 second:

```js
async function f() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000);
  });
  let result = await promise; // wait until the promise resolves
  alert(result); // "done!"
}
```

### Error handling

If a promise resolves normally, then `await promise` returns the result.
But in the case of a rejection, it throws the error, just as if there
were a `throw` statement at that line.

```js
// This code
async function f() {
  await Promise.reject(new Error("Whoops!"));
}

// ...is the same as this
async function f() {
  throw new Error("Whoops!");
}
```

We can catch errors using `try...catch`, the same way as a regular
`throw`:

```js
async function f() {
  try {
    let response = await fetch("https://no-such-url");
  } catch (err) {
    alert(err); // TypeError: failed to fetch
  }
}

f();
```

In the case of an error, the control jumps to the `catch` block. We
can also wrap multiple lines:

```js
async function f() {
  try {
    let response = await fetch("/no-user-here");
    let user = await response.json();
  } catch (err) {
    // catches errors both in fetch and response.json
    alert(err);
  }
}

f();
```

If we don't have `try...catch`, then the promise generated by the call
of the async function `f()` becomes rejected. We can append `.catch`
to handle it:

```js
async function f() {
  let response = await fetch("https://no-such-url");
}

// f() becomes a rejected promise
f().catch(alert); // TypeError: failed to fetch
```
