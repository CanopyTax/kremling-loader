const parser = require('postcss-selector-parser');

module.exports = ({ id, namespace }) => {
  function parseSelectors(ruleSelectors, left) {
    let scope = true;
    const output = parser(selectors => {
      if (left) {
        const s = selectors.first.first;
        if (s.type === 'pseudo') {
          if (s.value === ':global') {
            s.remove();
          }
          scope = false;
          return;
        }
      }
      selectors.each(selector => {
        const attr = parser.attribute({ attribute: `${namespace}="${id}"` });
        const combinator = parser.combinator({ value: ' ' });
        if (selector.at(0).type === 'class' || selector.at(0).type === 'id' || left) {
          selector.insertBefore(selector.at(0), attr);
          if (left) selector.insertAfter(selector.at(0), combinator);
        } else {
          selector.insertAfter(selector.at(0), attr);
        }
        return selector;
      });
    }).processSync(ruleSelectors, { lossless: false });
    return { output, scope };
  }
  return {
    postcssPlugin: 'postcss-kremling-plugin',
    Root(root) {
      root.walkRules(function (rule) {
        const { output: left, scope } = parseSelectors(rule.selector, true);
        let right = '';
        if (scope) {
          right = parseSelectors(rule.selector, false).output;
        }

        rule.selector = `${left.trim()}${right ? `,${right.trim()}` : ''}`;
        return rule;
      });
    },
  };
};

module.exports.postcss = true;
