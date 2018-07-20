const postcss = require('postcss');
const kremId = require('./kremling-id');

module.exports = postcss.plugin('postcss-kremling-plugin', function () {
  return function (root) {
    kremId.increment();
    root.walkRules(function (rule) {
      if (rule.selector[0] !== '.'
        && rule.selector[0] !== '#') {
        rule.selector = `${rule.selector}${kremId.getSelector()}, ${kremId.getSelector()} ${rule.selector}`;
      } else {
        rule.selector = `${kremId.getSelector()}${rule.selector}, ${kremId.getSelector()} ${rule.selector}`;
      }
      return rule;
    });
  };
});