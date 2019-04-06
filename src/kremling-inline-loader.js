const { getOptions } = require('loader-utils');
const postcss = require('postcss');
const postcssKremlingPlugin = require('./postcss-kremling-plugin');

const placeholderName = (id) => `__KREMLING_PLACEHOLDER_${id}__`;
let rootIndex = 0;

module.exports = function KremlingJsLoader(src) {
  const loaderOptions = getOptions(this) || {};
  let kremlingNamespace = 'kremling';
  if (loaderOptions.namespace && typeof loaderOptions.namespace === 'string') {
    kremlingNamespace = loaderOptions.namespace;
  }
  const defaultOptions = {
    plugins: {},
    ...loaderOptions.postcss,
  };

  const { plugins, ...restOfOptions } = defaultOptions;
  const pluginsInit = (Object.keys(plugins)).map(key => {
    return require(key)(plugins[key]);
  });

  const testRegex = new RegExp('krem`', 'g');
  let kremlings = [];
  let newSource = src;
  let outerPlaceholderMap = {};

  while(testRegex.exec(newSource)) {
    kremlings.push(testRegex.lastIndex);
  }
  // don't process lines if there's no kremlings
  if (!kremlings) return newSource;

  kremlings.forEach((k, kremlingIndex) => {
    let allKremlings = [];
    while(testRegex.exec(newSource)) {
      allKremlings.push(testRegex.lastIndex);
    }
    const start = allKremlings[kremlingIndex];
    const test = newSource.slice(start);
    const placeholderMap = {};
    let placeholder = 0;
    let end = -1;
    let offset = 0;

    // find end of template literal
    for (let i = 0; i < test.length && end === -1; i++) {
      if (test[i] === '$' && test[i + 1] === '{') {
        if (placeholder === 0) {
          placeholderMap[`${placeholderName(start)}`] = { startPlaceholder: start + i };
        }
        placeholder++;
      }
      if (test[i] === '}' && placeholder > 0) {
        placeholder--;
        if (placeholder === 0) {
          placeholderMap[`${placeholderName(start)}`].endPlaceholder = start + i + 1;
        }
      }
      // check for backtick, unless we're inside a placeholder
      if (placeholder === 0 && test[i] === '`' && test[i - 1] !== '\\') {
        end = start + i;
      }
    }

    // replace placeholders
    Object.keys(placeholderMap).forEach(key => {
      const { startPlaceholder, endPlaceholder } = placeholderMap[key];
      placeholderMap[key].content = newSource.slice(startPlaceholder, endPlaceholder);
      offset += placeholderMap[key].content.length - key.length;
      newSource = `${newSource.slice(0, startPlaceholder)}${key}${newSource.slice(endPlaceholder)}`;
    });

    // process css
    const css = postcss([ ...pluginsInit, postcssKremlingPlugin(`k${rootIndex}`, kremlingNamespace)])
      .process(newSource.slice(start, end - offset), {
        ...restOfOptions,
        to: './',
        from: './',
      }).css;
    newSource = `${newSource.slice(0, start)}\${'${kremlingNamespace}'}\${'k${rootIndex}'}${css}${newSource.slice(end - offset)}`;

    outerPlaceholderMap = {
      ...outerPlaceholderMap,
      ...placeholderMap,
    }
    rootIndex++;
  });

  // put placeholders back in
  Object.keys(outerPlaceholderMap).forEach(key => {
    const { content } = outerPlaceholderMap[key];
    newSource = newSource.replace(key, content);
  });

  return newSource;
}