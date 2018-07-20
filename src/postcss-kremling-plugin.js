const postcss = require('postcss');
const kremId = require('./kremling-id');

module.exports = postcss.plugin('postcss-kremling-plugin', function () {
  return function (root) {
    kremId.increment();
    root.walkRules(function (rule) {
      // split by comma and remove white space and returns
      const selectors = rule.selector.split(',');
      rule.selector = selectors.map(selector => {
        selector = selector.replace(/[\s]/g, '');
        if (selector[0] !== '.'
          && selector[0] !== '#') {
          return `${selector}${kremId.getSelector()},${kremId.getSelector()} ${selector}`;
        } else {
          return `${kremId.getSelector()}${selector},${kremId.getSelector()} ${selector}`;
        }
      }).join(',');
      return rule;
    });
  };
});