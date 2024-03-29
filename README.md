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

## No overdue TODOs/FIXMEs

```
  rules: [
    '@nozbe/nozbe/no-overdue-todos': 'warn',
  ]
```

This turns `TODO:` and `FIXME:` comments into a warning after a specified date, for example:

```js
// date given in yyyy-mm-dd format, but days and months can be omitted

// TODO(2024): Refactor X after Y is done
// FIXME(2023-03): Fix A once B is released
// TODO(2023-04-20): Remove this deprecation once version a.b.c is out
```

BTW: It can be helpful to set up your editor to highlight these comments. For example, for VS Code, use [TODO Highlight v2](https://marketplace.visualstudio.com/items?itemName=jgclark.vscode-todo-highlight) with this configuration:

```json5
"todohighlight.keywords": [
  {
    "text": "TODO(string):",
    "regex": {
      "pattern": "(?<=^|\"|\\s)TODO(\\([^)]+\\))?:"
    },
    "color": "#fff",
    "backgroundColor": "#ffbd2a",
    "overviewRulerColor": "rgba(255,189,42,0.8)",
    "diagnosticSeverity": "error"
  },
  {
    "text": "FIXME(string):",
    "regex": {
      "pattern": "(?<=^|\"|\\s)FIXME(\\([^)]+\\))?:"
    },
    "color": "#fff",
    "backgroundColor": "#f06292",
    "overviewRulerColor": "rgba(240,98,146,0.8)",
    "diagnosticSeverity": "warning"
  }
]
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

This auto-fixes to:

```js
// If configured with { exactByDefault: true }
const foo: {| a: true |}

// If configured with { exactByDefault: false }
// Note that this auto-fix is not perfect, and it sometimes places one comma too many before `...`
// When mass-auto-fixing, run regex find `,[\s\n]+, \.{3} \}` and replace with `, ... }`
const foo: { a: true, ... }
```

## Flow: No shorthand exact objects

```js
  rules: [
    '@nozbe/nozbe/flow-no-shorthand-exact-object': 'warn',
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

## Max lines

```js
  rules: [
    '@nozbe/nozbe/max-lines': [
      'warn',
      { max: 600 }
    ],
  ]
```

This rule disallows file longer than `max` lines.

This is very similar to ESLint's builtin `max-lines` rule. The main difference is that `max-lines`
will highlight all offending lines red/yellow in your IDE, which is very annoying. `@nozbe/nozbe/max-lines`
will only highlight the top line, in addition to producing a message in eslint output.

This is good when you don't want to enforce this rule as an error, merely a warning - something to be
dealt with at the nearest convenience, not something you have to drop everything you're doing to fix.
IMO, the official rule's behavior encourages the developer to just silence the error for the whole file,
which defeats the point.

## No `invariant()` without message

```js
  rules: [
    '@nozbe/nozbe/no-invariant-without-message': 'error',
  ]
```

This rule disallows `invariant()` to be called without the second parameter, enforcing that errors thrown must
produce a helpful message.

```js
// bad:
invariant(someCondition)

// good:
invariant(someCondition, 'Some condition was not met!')
```

## No `in` expressions

```js
  rules: [
    '@nozbe/nozbe/no-in-expression': 'error',
  ]
```

This rule disallows `'foo' in bar` expressions. These expressions can easily produce the wrong (potentially
unsafe) behavior if you're not careful (e.g. `'toString' in {}` is `true`; also inheritance, etc.)

You probably want to have in your project a convenient shortcut to `Object.prototype.hasOwnProperty.call(obj, prop)` which has
a less error-prone behavior.
