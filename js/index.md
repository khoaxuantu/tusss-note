---
title: JAvAsCrIpt
title_template: Tusss Notes | %s
date: 2023-06-16
next_article:
  path: /js/fundamental
  title: Fundamental
---

# Uncommon JavaScript Notes

## Introduction

> JavaScript is super complicated, like a pain in your ass. Even when you are pretty familiar
> with other programming languages' logic and concepts, you still find it challenging to cover significant
> aspects of JS.

Let me tell you one story... I once started learning JavaScript with a mindset that "just like other
programming languages". Honestly, it does have enough general programming concepts that help me
gain some first tastes quickly. It has variables, operators, functions, objects and classes, which
can make a newbie think: "Uhm ~~ I can understand it easily!".

But the thing doesn't go as you expected, not like variables in C++, variables in JavaScript have
`var`, `const` and `let`; not like a single `def` in
Python, JavaScript can initiate a function in two ways: function declaration and function expression.
Thus, I didn't understand its fundamentals the first time studying, and regularly lost track
of my thinking flow when looking up its advanced topic.

Although I have done some projects using extended
JavaScript and libraries/frameworks such as React, ExpressJS, etc..., I still had a vague picture about
prototypes, asynchronous, error handling, and so forth.

Things even got worse, I got an invitation to a whiteboard technical interview for a full-stack developer role, in which they
asked me about JavaScript. Initially, I believe naively my fundamental ideas can handle their questions - "Well!
Just some JS questions like tutorials".

However, they gave me a question about asynchronous which is
one of my most vulnerable parts. They asked me about a promise chain meanwhile I just had been familiar with a
single promise. As a result, I solved it incompletely and failed the interview. 🥲

```js
// Refactor the function below to async/await structure
function A() {
  return new Promise((resolve, reject) => {
    resolve(B);
  })
  .then(resB => {
    return C(resB);
  })
  .catch(err => {
    console.log(`First error: ${err}`);
  });
  .then(resC => {
    return D(resC);
  })
  .then(resD => {
    console.log(resD);
  })
  .catch(err => {
    console.log(`Second error: ${err}`);
  })
}
```

After the interview, I realized my huge gap in knowledge about JavaScript, so I started reviewing
it again.

## Acknowledgement

My keynotes are based on [javascript.info](https://javascript.info/). It does not
have very fundamental topics, instead, it contains concepts that I can easily mismatch when learning.

So for looking up JavaScript basics, you can refer to [javascript.info tutorials](https://javascript.info/)
directly or [MDN (Mozilla) JavaScript manual](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
