const { getOptions } = require('loader-utils');
const postcss = require('postcss');
const kremId = require('./src/kremling-id');
const postcssKremling = require('./src/postcss-kremling-plugin');

module.exports = function(source) {
  const defaultOptions = {
    plugins: {},
    ...getOptions(this),
  };

  const { plugins, ...restOfOptions } = defaultOptions;
  pluginsInit = (Object.keys(plugins)).map(key => {
    return require(key)(plugins[key]);
  });

  const callback = this.async();
  postcss([ ...pluginsInit, postcssKremling() ])
    .process(source, {
      ...restOfOptions,
      to: './',
      from: './',
    })
    .then((result) => {
      if (result.css) {
        callback(null, `export default { styles: \`${result.toString()}\`, id: \`${kremId.getSelector()}\` };`);
      } else {
        callback(null, `export default { styles: '', id: \`${kremId.getSelector()}\`};`);
      }
    });
};