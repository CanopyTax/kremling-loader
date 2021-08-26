const parser = require('postcss-selector-parser');

module.exports = ({ id, namespace }) => {
  function parseSelectors(ruleSelectors, space) {
    return parser(selectors => {
      selectors.each(selector => {
        const attr = parser.attribute({ attribute: `${namespace}="${id}"` });
        const combinator = parser.combinator({ value: ' ' });
        if (selector.at(0).type === 'class' || selector.at(0).type === 'id' || space) {
          selector.insertBefore(selector.at(0), attr);
          if (space) selector.insertAfter(selector.at(0), combinator);
        } else {
          selector.insertAfter(selector.at(0), attr);
        }
        return selector;
      });
    }).processSync(ruleSelectors, { lossless: false });
  }

  return {
    postcssPlugin: 'postcss-kremling-plugin',
    Root(root) {
      root.walkRules(function (rule) {
        rule.selector = `${parseSelectors(rule.selector, true).trim()},${parseSelectors(rule.selector, false).trim()}`;
        return rule;
      });
    },
  };
};

module.exports.postcss = true;
