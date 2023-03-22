# eslint-plugin-nozbe

A collection of helpful ESLint rules we created while building [Nozbe](https://nozbe.com) app.

## Installation

```sh
yarn add --dev @nozbe/eslint-plugin-nozbe
```

In your `.eslintrc.{js,yml,json}`, add plugin:

```js
  plugins: [
    '@nozbe/nozbe',
  ],
```

Then add rules you want to include

## JSX: no `&&`

```js
  rules: [
    '@nozbe/nozbe/no-jsx-andand': 'error',
  ]
```

This raises an error for `&&` used in JSX expressions, like so:

```js
<>
  {shouldShowFoo && <Foo />}
</>
```

Expressions like this behave differently on React and React Native: [instead of not displaying, it can evaluate to 0, NaN, or cause a crash in some cases.](https://twitter.com/kadikraman/status/1507654900376875011).

This auto-fixes to:

```js
<>
  {shouldShowFoo ? <Foo /> : null}
</>
```

## No argument spread

```
/* eslint @nozbe/nozbe/no-arg-spread: error */
```

This raises an error when spread is used on a call expression, like so:

```js
someFunction(...args)
```

This isn't something you generally need to enable for a whole project. However, you should be aware that spreading very large arrays (tens of thousands of elements) can cause a "RangeError: Maximum call stack size exceeded" error. In such cases, [you should pass the array as a single argument](https://twitter.com/radexp/status/1638195031881252868) instead.

## No optional catch binding

```js
  rules: [
    '@nozbe/nozbe/no-catch-without-param': 'error',
  ]
```

This raises an error for `catch` clause without binding, like so:

```js
try {
  foo()
} catch {
  fallback()
}
```

Since this is a relatively new addition to JavaScript, it can cause unexpected failure of JS tooling, sometimes at runtime.

This auto-fixes to:

```js
try {
  foo()
} catch (_error) {
  fallback()
}
```

## Imports: No imports

```
/* eslint @nozbe/nozbe/no-imports: error */
```

This raises an error when `import`s are used instead of `require()`.

This isn't something you generally need to enable for a whole project.

However, in some cases you want to make sure that `require()` is used to order calls in a specific order. For example, in application bootstrapping code, you might want to ensure that you `require()` a crash collection library, then initialize it, before requiring other code.
Normally, `import`s would all be reordered to the top, breaking the strict ordering.

## Imports: No namespaced imports

```
/* eslint @nozbe/nozbe/no-namespaced-imports: error */
```

This raises an error when namespaced imports are used, like so:

```js
import * as Foo from 'bar'
```

In some cases, you might want to ensure that namespaced imports aren't used in a project or in specific files as to not balloon bundle or chunk size.

## Flow: No shorthand exact objects

```js
  rules: [
    '@nozbe/nozbe/flow-no-shorthand-exact-object': 'error',
  ]
```

This raises an error when shorthand exact objects are used:

```js
const foo: {| a: true |}
```

This syntax breaks VS Code's code coloring unfortunately...

This auto-fixes to:

```js
const foo: $Exact<{ a: true }>
```

## Flow: No ambiguous object exactness

```js
  rules: [
    '@nozbe/nozbe/flow-no-ambiguous-object-exactness': [
      'error',
      { exactByDefault: false }
    ],
  ]
```

This raises an error when ambiguous objects (not explicitly exact or inexact) are used, except for indexed objects:

```js
// bad:
const foo: { a: true }

// good:
const foo: {| a: true |}
const foo: $Exact<{ a: true }>
const foo: { a: true, ... }
const foo: { [string]: boolean }
```

The problem with ambiguous object exactness is that Flow is in the process of migrating from "inexact objects by default" to "exact objects by default", and until this migration is complete, different users can have objects configured differently. This can be confusing, it makes it hard to migrate from inexact to exact objects, and is particularly a problem if you are shipping a library using Flow (e.g. [WatermelonDB](https://github.com/Nozbe/WatermelonDB)), since its users can have different Flow configurations.
