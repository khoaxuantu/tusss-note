---
unlisted: true
title: Modules
date: 2023-06-16
prev_article:
  path: /js/generators
  title: Generators, advanced iteration
---

# Modules

## Modules, introduction

```js
import { sayHi } from "./sayHi.js";
```

Core module features:

- Always "use strict"
- Module level scope

```html
<!DOCTYPE html>
<script type="module" src="hello.js"></script>
```

- A module code is evaluated only the first time when imported

```js
// 📁 alert.js
alert("Module is evaluated!");
```

```js
// Import the same module from different files
// 📁 1.js
import "./alert.js"; // Module is evaluated!

// 📁 2.js
import "./alert.js"; // (shows nothing)
```

- import.media

  The object `import.media` contains the information about the current module.

```html
<script type="module">
  alert(import.meta.url); // script URL
  // for an inline script - the URL of the current HTML-page
</script>
```

- In a module, "this" is undefined

```html
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

## Dynamic imports

First, we can't dynamically generate any parameters of `import`. The module path must be a primitive string, can't be a function call.
This won't work:

```js
import ... from getModuleName(); // Error, only from "string" is allowed
```

Second, we can't import conditionally or at run-time:

```js
if (...) {
  import ...; // Error, not allowed!
}

{
  import ...; // Error, we can't put import in any block
}
```

But how can we import a module dynamically, on-demand?

### The import() expression

The `import(module)` expression loads the module and returns a promise
that resolves into a module object that contains all its exports. It
can be called from any place in the code.

```js
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then(obj => console.log(obj));
  .catch(err => console.log("loading error, e.g. if no such module"));

// We could import like this if inside any async function
let module = await import(modulePath);
```
