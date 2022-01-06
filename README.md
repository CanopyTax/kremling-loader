# kremling-loader

[![npm version](https://img.shields.io/npm/v/kremling-loader.svg?style=flat-square)](https://www.npmjs.org/package/kremling-loader)

The [`Kremling`](https://github.com/CanopyTax/kremling) webpack loader is an abstraction
on top of the awesome [`Postcss`](https://github.com/postcss/postcss) project.
It allows you to process your css the way you'd like, and then it passes formatted data
to the `<Scoped>` component.

## Install

NPM:
```bash
$ npm install -D kremling-loader
```

Yarn:

```bash
$ yarn add -D kremling-loader
```

## Setup

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'kremling-loader',
            options: {
              namespace: 'custom-namespace',
              postcss: {},
            },
          },
        ],
      },
    ],
  }
}
```

### Loader Options


| property    | type     | default     | description |
| ----------- | -------- | ----------- | ----------- |
| `namespace` | `string` | kremling-id | Customize the scoped namespace (helpful if you have multiple apps running kremling at the same time). **`<Scoped>` Note**: Passing a name through the `namespace` prop is not necessary when using the this loader option.  |
| `postcss`   | `object` | null        | Pass-through options for postcss - all postcss options are accepted here |

Since the `postcss` property is a straight pass through for `postcss` options, we can add any plugin
we want into it.

- Want to prefix your css? Use the `autoprefixer` plugin.
- Want to minify your css? Use the `cssnano` plugin.
- Want nesting and other staged css features? Use the `precss` plugin.

### Loader chaining

Chaining loaders allows you to take advantage of more powerful tools like `SCSS` or `LESS` before
passing css to the `kremling-loader`:

```js
// webpack.config.js
...
{
  test: /\.scss$/,
  use: ['kremling-loader', 'sass-loader' ]
}
...
```

This loader requires the input to be a plain string resource, so if you use something like the
`css-loader` (which converts css to a CommonJS module), you'll need to use the `extract-loader` before
passing it to `kremling-loader`:

```js
// webpack.config.js
...
{
  test: /\.scss$/,
  use: ['kremling-loader', 'extract-loader', 'css-loader' ]
}
...
```

## Use

First, write your css:

```css
/* style.css */
.container {
  background-color: red;
}
```

We then `import` our styles into our component file, and pass it to the `useCss` hook:

```js
import React from 'react';
import css from './style.css';

export default function Foo(props) {
  const scope = useCss(css);
  
  return <div {...scope} className="container"></div>
}
```

Alternatively, for class components:

```js
import React, { Component } from 'react';
import css from './style.css';

export default class Foo extends Component {
  render() {
    return (
      <Scoped postcss={css}>
        <div className="container">Hello World!</div>
      </Scoped>
    );
  }
}
```

## Opt-out of scoping

### A quick look at `kremling` scoping
`kremling` css by default is **global**, and it requires you to opt-in to scoping by
prepending an ampersand (&) symbol at the beginning of each rule:

```js

const css = `
  .global {
    background-color: blue;
  }

  & .scoped {
    background-color: red;
  }
`;

```

### `kremling-loader` scoping

Funny enough, `kremling-loader` is the exact opposite 🥴. Since the loader
intelligently adds scoping without ampersands, by default, the css is always
**scoped**. You have to opt-out of scoping by  prepending a `:global` pseudo
class at the beginning of your rule:

```scss
// scoped
.scoped {
  background-color: blue;
}

// global
:global .global {
  background-color: red;
}
```
