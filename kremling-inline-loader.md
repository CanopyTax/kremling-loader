# Kremling inline loader

The `kremling-inline-loader` is a webpack loader that processes your
javascript that have`k` tagged templates in them. You can learn more about the
`k` tagged template and how to use it in the
[Kremling docs](https://kremling.js.org/api/k-tagged-template.html).

Just like the [Kremling loader](https://kremling.js.org/walkthrough/kremling-loader.html),
the `kremling-inline-loader` processes `css` using `postcss` so you don't have
to use ampersands. Unlike the `kremling-loader` though, you can do all of this
inside your js!

### How it works

The `kremling-inline-loader` parses `js` files during build time and looks for
`k` tagged template literals. eg:

```javascript
const styles = k`
  .test {
    background-color: red;
  }
`;
```

Normally, kremling would require ampersands (`&`) before each rule so it knew
where to add the scoping. But with the power of `postcss`, we can omit the
ampersands and add the scoping attributes to all the styling rules.

### Install

```shell
$ npm install kremling-loader -D
```

### Setup

It is recommended to first pass js files through the `kremling-inline-loader`
before other loaders like `babel-loader` get to it. This allows it to
find all the `k` tags before other manipulation in the files happens.

Since the `kremling-inline-loader` is not the main export, we have to point
to it in the `node_modules`:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // any loader you want (like babel-loader)
          {
            loader: path.resolve(__dirname, 'node_modules/kremling-loader/src/kremling-inline-loader.js'),
            options: {
              namespace: 'custom',
              postcss: {
                plugins: {
                  'autoprefixer': {},
                },
              },
            },
          },
        ],
      },
    ],
  },
};
``` 

### Example

```js
import React from 'react';
import { useCss, k } from 'kremling';

function Yoshi(props) {
  const scope = useCss(css)

  return (
    <div {...scope} className="container">
      <p className="yoshi-description">
        Yoshi is a fictional dinosaur who, although intelligent,
        is enslaved by a human plumber named Mario.
      </p>
    </div>
  )
}

const css = k`
  .container {
    background-color: red;
  }
`;
```

## Advantages

- Using kremling-inline-loader allows you to omit the `&` in your css rules.
- Processing happens at build time - less work for kremling at run time.
- Using the `k` tagged template allows you to capture it for syntax highlighting,
much like how `styled-components` plugins work. More to come on this topic!

## Disavantages
If you're using [create react app](https://facebook.github.io/create-react-app/), you'll have to eject your webpack configuration in order to add kremling-inline-loader to it.
