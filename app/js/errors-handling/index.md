---
unlisted: true
title: Errors Handling
date: 2023-06-16
prev_article:
  path: /js/classes
  title: Classes
next_article:
  path: /js/promises
  title: Promises, async/await
---

# Errors Handling

```js
try {
  // run this code
} catch (err) {
  // If an error happened, then jump here
  // err is the error object
} finally {
  // do in any case after try/catch
}
```

## Custom errors, extending Error

- Extending Error

  The `Error` class is built-in, but here's its approximation code so
  we can understand what we're extending

```js
// The "pseudocode" for the built-in Error class defined by JavaScript itself
class Error {
  constructor(message) {~
    this.message = message;
    this.name = "Error"; // (different names for different built-in error classes)
    this.stack = "\{{ call stack }}"; // non-standard, but most environments support it
  }
}
```

Inherit `ValidationError` from it:

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function test() {
  throw new ValidationError("Whoops!");
}

try {
  test();
} catch (err) {
  alert(err.message); // Whoops!
  alert(err.name); // ValidationError
  alert(err.stack); // a list of nested calles with lines numbers for each
}
```

Further inheritance:

```js
class PropertyRequiredError extends ValidationError {
  constructor(property);
  super("No property: " + property);
  this.name = "PropetyRequiredError";
  this.property = property;
}

// Usage
function validateUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new PropertyRequiredError("age");
  }
  if (!user.name) {
    throw mew PropertyRequiredError("name");
  }

  return user;
}

// Example with try...catch
try {
  let user = validateUser('{ "age": 25 }');
} catch {
  if (err instanceof ValidationError) {
    alert("Invalid data: " + err.message);
    alert(err.name); // PropertyRequiredError
    alert(err.property); // name
  } else if (err instanceof SyntaxError) {
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err;
  }
}
```

Wrapping exceptions:

There can be more types of errors and we may not want to check for all
error types one-by-one everytime, so we may need an exception wrapper.

```js
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "ReadError";
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ReadError("Syntax Error", err);
    } else {
      throw err;
    }
  }

  try {
    validateUser(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ReadError("Validation Error", err);
    } else {
      throw err;
    }
  }
}

try {
  readUser("{bad json}");
} catch (e) {
  if (e instanceof ReadError) {
    alert(e);
    alert("Original error: " + e.cause);
  } else {
    throw e;
  }
}
```
