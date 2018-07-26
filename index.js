const { getOptions } = require('loader-utils');
const postcss = require('postcss');
const kremId = require('./src/kremling-id');
const postcssKremling = require('./src/postcss-kremling-plugin');

module.exports = function(source) {
  const loaderOptions = getOptions(this) || {};
  let kremlingNamespace = 'data-kremling';
  let kremlingNamespaceString = '';
  if (loaderOptions.namespace && typeof loaderOptions.namespace === 'string') {
    kremlingNamespace = loaderOptions.namespace;
    kremlingNamespaceString = `namespace: '${loaderOptions.namespace}'`;
  }
  const defaultOptions = {
    plugins: {},
    ...loaderOptions.postcss,
  };

  const { plugins, ...restOfOptions } = defaultOptions;
  pluginsInit = (Object.keys(plugins)).map(key => {
    return require(key)(plugins[key]);
  });

  const callback = this.async();
  postcss([ ...pluginsInit, postcssKremling(kremlingNamespace)() ])
    .process(source, {
      ...restOfOptions,
      to: './',
      from: './',
    })
    .then((result) => {
      if (result.css) {
        callback(null, `module.exports = { styles: '${result.toString().replace(/(\s)+/g, ' ').replace(/'/g, `\\'`)}', id: '${kremId.id}', ${kremlingNamespaceString} };`);
      } else {
        callback(null, `module.exports = { styles: '', id: '${kremId.id}', ${kremlingNamespaceString} };`);
      }
    });
};