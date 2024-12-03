---
unlisted: true
title: Generators, Advanced Iteration
date: 2023-06-16
prev_article:
  path: /js/promises
  title: Promises, async/await
next_article:
  path: /js/modules
  title: Modules
---

# Generators, Advanced Iteration

## Generators

Regular functions return only one, single value (or nothing).

Generators can return ("yield") multiple values, one after another,
on-demand. They work great with [iterables](#iterables), allowing
to create data streams with ease.

### Generator functions

To create a generator, we need a special syntax construct: `function*`,
so-called "generator function".

```js
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

// "generator function" creates "generator object"
let generator = generateSequence();
alert(generator); // [object Generator]

let one = generator.next();
alert(JSON.stringify(one)); // {value: 1, done: false}

let two = generator.next();
alert(JSON.stringify(two)); // {value: 2, done: false}

let three = generator.next();
alert(JSON.stringify(three)); // {value: 3, done: true}
```

### Generators are iterable

```js
// We can loop over their values using `for...of`
for (let value of generator) {
  alert(value); // 1, then 2 but doesn't show 3
  // for...of ignores the last value when done: true
}

// We can call all related functionality, e.g the spread syntax ...
let sequence = [0, ...generateSequence()];
alert(sequence); // 0, 1, 2, 3
```

### Generator composition

Generator composition is a special feature of generators that allows
to transparently "embed" generators in each other.

For instance, we have a function that generates a sequence of numbers:

```js
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
```

Now we'd like to reuse it to generate a more complex sequence:

- First, digits `0...9` (with charactar codes 48...57)
- Followed by uppercase alphabet letters `A...Z` (character codes 65...90)
- Followed by lowercase alphabet letters `a...z` (character codes 97...122)

For generators, there's a special `yield*` syntax to "embed" (compose)
one generator into another.

```js
function* generatePasswordCodes() {
  // 0...9
  // Same as `for(let i = start; i <= end; i++) yield i;`
  yield* generateSequence(48, 57);
  // A...Z
  yield* generateSequence(65, 90);
  // a...z
  yield* generateSequence(97, 122);
}

let str = "";

for (let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}

alert(str); // 0...9A...Za...z
```

### "yield" is a two-way street

`yield` are much more powerful and flexible. It not only returns the
result to the outside, but also can pass the value inside the
generator.

To do so, we should call `generator.next(arg)`, with an argument. That
argument becomes the result of `yield`.

```js
function* gen() {
  let ask1 = yield "2 + 2 = ?";

  alert(ask1); // 4

  let ask2 = yield "3 * 3 = ?";

  alert(ask2); // 9
}

let generator = gen();

alert(generator.next().value); // "2 + 2 = ?"
alert(generator.next(4).value); // "3 + 3 = ?"
alert(generator.next(9).done); // true
```

### Generator.throw

To pass an error into a `yield`, we should call `generator.throw(err)`.
In that case, the `err` is thrown in the line with that `yield`.

```js
function* gen() {
  try {
    let result = yield "2 + 2 = ?";
    alert("The execution does not reach here, because the exception is thrown above");
  } catch (e) {
    alert(e); // shows the error
  }
}

let generator = gen();
let question = generator.next().value;
generator.throw(new Error("The answer is not found in my database"));
```

### Generator.return

`generator.return(value)` finishes the generator execution and return
the given `value`.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();
g.next(); // {value: 1, done: false}
g.return("foo"); // {value: "foo", done: true}
g.next(); // {value: undefined, done: true}
```

## Async iteration and generators

Asynchronous iteration allow us to iterate over data that comes
asynchrorously, on-demand. Like, for instance, when we download
something chunk-by-chunk over a network.

### Recall iterables

Let's recall the topic about [iterables](#iterables).

```js
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    // called once, in the beginning of for...of
    return {
      current: this.from,
      last: this.to,

      next() {
        // called every iteration, to get the next value
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      },
    };
  },
};

for (let value of range) {
  alert(value); // 1 then 2, then 3, then 4, then 5
}
```

### Async iterables

Asynchronous iteration is needed when values come asynchronously:
after `setTimeout` or another kind of delay.

To make an object iterable asynchronously:

1.  Use `Symbol.asyncIterator` instead of `Symbol.iterator`.
2.  The `next()` method should return a promise (to be fulfilled with the next value).

    The `async` keyword handles it, we can simply make `async next()`.

3.  To iterate over such an object, we should use a `for await (let item of iterable)` loop.

    Note the `await` word.

```js
let range = {
  from: 1,
  to: 5,

  [Symbol.asyncIterator]() {
    return {
      current: this.from,
      last: this.to,

      async next() {
        // not : we can use "await" inside the async next:
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (this.current <= this.last) {
          return {doneL false, value: this.current++};
        } else {
          return {done: true};
        }
      }
    };
  }
};

(async () => {
  for await (let value of range) {
    alert(value); // 1,2,3,4,5
  }
})()
```

[table caption="Differences between **Iterators** and **Async iterators**"]
  | Iterators | Async iterators
  Object method to provide iterator | `Symbol.iterator` | `Symbol.asyncIterator`
  `next()` return value is | any value | `Promise`
  to loop, use | `for...of` | `for await...of`

### Recall generators

Let's recall the topic about [generators](#generators). Generators
are labelled with `function*` (not the start) and use `yield` to
generate a value, then we can use `for...of` to loop over them.

```js
function* generateSequence(start, end) {
  for (let i = start, i <= end; i++) yield i;
}

for (let value of generateSequence(1, 5)) {
  alert(value); // 1, then 2, then 3, then 4, then 5
}
```

A common practice for `Symbol...iterator` is to return a generator:

```js
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() {
    // a shorthand for [Symbol.iterator]: function*()
    for (let value = this.form; value <= this.to; value++) {
      yield value;
    }
  },
};

for (let value of ragne) {
  alert(value); // 1, then 2, then 3, then 4, then 5
}
```

> In regular generators we can't use `await`. All values must come
> synchronously, as required by the `for...of` construct.

### Async generators

The syntax is to prepend `function*` with `async`. That makes the
generator asynchronous. And then use `for await (...)` to iterate over
it:

```js
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield i;
  }
}

(async () => {
  let generator = generateSequence(1, 5);
  for await (let value of generator) {
    alert(value); // 1, then 2, then 3, then 4, then 5 (with delay between)
  }
})();
```

_Async iterable range_

```js
let range = {
  from: 1,
  to: 5,

  // this line is same as [Symbol.asyncIterator]: async function*()
  async *[Symbol.asyncIterator]() {
    for (let value = this.from, value <= this.to; value++) {
      // make a pause between values, wait for something
      await new Promise(resolve => setTimeout(resolve, 1000));
      yield value;
    }
  }
};

(async () => {
  for await (let value of range) {
    alert(value); // 1, then 2, then 3, then 4, then 5
  }
})():
```
