const postcss = require('postcss');
const parser = require('postcss-selector-parser');
const kremId = require('./kremling-id');

module.exports = function(namespace) {
  function parseSelectors(ruleSelectors, space) {
    return parser(selectors => {
      selectors.each(selector => {
        const attr = parser.attribute({ attribute: `${namespace}="${kremId.id}"` });
        const combinator = parser.combinator({ value: ' ' });
  
        if (selector.at(0).type === 'class' || selector.at(0).type == 'id' || space) {
          selector.insertBefore(selector.at(0), attr);
          if (space) selector.insertAfter(selector.at(0), combinator);
        } else {
          selector.insertAfter(selector.at(0), attr);
        }
        return selector;
      });
    }).processSync(ruleSelectors, { lossless: false });
  }  

  return postcss.plugin('postcss-kremling-plugin', function () {
    return function (root) {
      kremId.increment();
      root.walkRules(function (rule) {
        rule.selector = `${parseSelectors(rule.selector, true)},${parseSelectors(rule.selector, false)}`;
        return rule;
      });
    };
  });
}