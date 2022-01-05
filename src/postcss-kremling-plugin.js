const parser = require('postcss-selector-parser');

module.exports = ({ id, namespace }) => {
  return {
    postcssPlugin: 'postcss-kremling-plugin',
    Root(root) {
      root.walkRules(function (rule) {
        rule.selector = parser(selectors => {
          selectors.each(selector => {
            // omit pseudo classes
            if (selector.first.type === 'pseudo') {
              if (selector.first.value === ':global') {
                selector.first.remove();
              }
              return selector;
            }

            if (selector.first.type === 'class' || selector.first.type === 'id') {
              const attr = parser.attribute({ attribute: `${namespace}="${id}"` });
              const newSelector = selector.clone();
              newSelector.insertAfter(selector.at(0), parser.combinator({ value: ' ' }));
              newSelector.insertAfter(selector.at(1), attr);
              selector.insertBefore(selector.first, newSelector);
              selector.insertAfter(selector.at(0), parser.combinator({ value: ', ' }));
              selector.insertAfter(selector.at(1), attr);
            }
            return selector;
          });
        }).processSync(rule.selector, { lossless: false });
        return rule;
      });
    },
  };
};

module.exports.postcss = true;
