const { getOptions } = require('loader-utils');
const postcss = require('postcss');
const postcssKremling = require('./src/postcss-kremling-plugin');

let globalId = 0;

module.exports = function(source) {
  const id = globalId;
  globalId += 1;
  const loaderOptions = getOptions(this) || {};
  let kremlingNamespace = 'kremling';
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
  postcss([ ...pluginsInit, postcssKremling(id, kremlingNamespace)() ])
    .process(source, {
      ...restOfOptions,
      to: './',
      from: './',
    })
    .then((result) => {
      if (result.css) {
        callback(null, `module.exports = { styles: '${result.toString().replace(/(\s)+/g, ' ').replace(/'/g, `\\'`)}', id: 'p${id}', ${kremlingNamespaceString} };`);
      } else {
        callback(null, `module.exports = { styles: '', id: 'p${id}', ${kremlingNamespaceString} };`);
      }
    });
};