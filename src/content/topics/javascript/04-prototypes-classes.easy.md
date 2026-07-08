---
title: Prototypes & Classes
order: 4
estMinutes: 15
difficulty: easy
checklist:
  - Trace the prototype chain to explain how property lookup works
  - Distinguish __proto__ (instance link) from .prototype (constructor property)
  - Rewrite a prototype-based pattern using ES6 class syntax
  - Use extends and super to create a subclass
  - Explain why ES6 classes are called "syntactic sugar" over prototypes
  - Use instanceof to check an object's prototype chain
---

A **class** is a blueprint for making objects. If you're building a game, you might have a `Dog` blueprint, and stamp out many dog objects from it — each with its own name, but all sharing the same abilities like `speak()`.

## A simple class

```ts
class Animal {
  constructor(name) {
    this.name = name       // each animal gets its own name
  }
  speak() {
    return `${this.name} makes a noise.`
  }
}

const rex = new Animal('Rex')  // `new` stamps out a fresh object
rex.speak()                    // "Rex makes a noise."
```

`constructor` runs once when you create the object, and it's where you set up its starting data.

## Building on a class: `extends`

You can make a specialized version of a class. A `Dog` *is an* `Animal`, but with extras:

```ts
class Dog extends Animal {
  constructor(name, breed) {
    super(name)        // run Animal's setup first
    this.breed = breed
  }
  speak() {
    return `${this.name} barks.`  // replaces Animal's version
  }
}

const rex = new Dog('Rex', 'Labrador')
rex.speak()  // "Rex barks."
```

> [!IMPORTANT]
> When a class `extends` another, you must call `super()` before using `this` in the constructor. `super()` runs the parent's setup — skip it and JavaScript throws an error.

## Checking a type with `instanceof`

`instanceof` asks "was this made from that blueprint?":

```ts
rex instanceof Dog     // true
rex instanceof Animal  // true — a Dog is also an Animal
```

## A peek under the hood

JavaScript actually links objects together in a chain (the "prototype chain"), and `class` is a friendlier way to write that. You don't need the deep details yet — just know that when you call `rex.speak()`, JavaScript looks on the dog first, then on its `Animal` blueprint, and uses the first `speak` it finds.

## In one sentence

A `class` is a blueprint: `constructor` sets up each new object, methods are shared abilities, `extends` + `super()` build specialized versions, and `instanceof` checks what blueprint an object came from.

## Want to go deeper?

Switch to **Expert** mode above for the full prototype chain, `__proto__` vs `.prototype`, and how classes are "syntactic sugar" over prototypes.
