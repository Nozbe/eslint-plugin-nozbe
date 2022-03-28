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

## JSX no `&&`

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
