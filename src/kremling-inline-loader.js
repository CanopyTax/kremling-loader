const postcss = require('postcss');
const { getOptions } = require('loader-utils');

const postcssKremlingPlugin = require('./postcss-kremling-plugin');
const { testKremling, testPlaceholder } = require('./kremling-inline-loader.utils');

const placeholderName = (id) => `__KREMLING_PLACEHOLDER_${id}__`;
const ruleName = (id) => `__KREMLING_RULE_${id}__`;
let rootIndex = 0;

module.exports = function KremlingInlineLoader(src) {
  const ruleIndex = rootIndex;
  rootIndex++;

  // loader options
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

  // loader stuff
  const callback = this.async();
  const chars = Array.from(src);
  const ruleMap = {};
  let newSource = src;
  let offset = 0;

  let config = {
    placeholderDepth: 0,
    startArray: [],
    endArray: [],
  };

  // skip files that don't use the kremling tag
  if (!src.match(/=(\s+)k`|=k`/g)) return callback(null, src);

  for (let i = 0; i < chars.length; i++) {
    config = testKremling(newSource, i, config);
  }

  config.startArray.forEach((item, i) => {
    const start = item - offset;
    const end = config.endArray[i] - offset;
    const label = ruleName(i);
    const content = newSource.slice(start, end);
    ruleMap[label] = { label, content, placeholders: [] };
    newSource = `${newSource.slice(0, start)}${label}${newSource.slice(end)}`;
    offset += content.length - label.length;
  });

  const processMap = Object.keys(ruleMap).reduce((processes, ruleKey) => {
    let ruleOffset = 0;
    let ruleContent = ruleMap[ruleKey].content;
    let ruleLabel = ruleMap[ruleKey].label;
    const ruleChars = Array.from(ruleContent);
    let ruleConfig = {
      placeholderDepth: 0,
      startArray: [],
      endArray: [],
    };
    for (let i = 0; i < ruleChars.length; i++) {
      ruleConfig = testPlaceholder(ruleContent, i, ruleConfig);
    }

    const placeholders = ruleConfig.startArray.map((item, i) => {
      const start = item - ruleOffset;
      const end = ruleConfig.endArray[i] - ruleOffset;
      const label = placeholderName(i);
      const content = ruleMap[ruleKey].content.slice(start, end);
      ruleMap[ruleKey].content = `${ruleMap[ruleKey].content.slice(0, start)}${label}${ruleMap[ruleKey].content.slice(end)}`;
      ruleOffset += content.length - label.length;
      return { label, content };
    });

    return [
      ...processes,
      {
        ruleLabel,
        placeholders,
        process: postcss([ ...pluginsInit, postcssKremlingPlugin(`k${ruleIndex}`, kremlingNamespace)])
          .process(ruleMap[ruleKey].content, {
            ...restOfOptions,
            to: './',
            from: './',
          })
      }
    ];
  }, []);

  Promise.all(processMap.map(p => p.process)).then((results) => {
    for (let i = 0; i < results.length; i++) {
      let { css } = results[i];
      const { placeholders, ruleLabel } = processMap[i];
      // add placeholders back in
      for (let j = 0; j < placeholders.length; j++) {
        const { label, content } = placeholders[j];
        css = css.replace(label, content);
      }
      // add rule back in
      const SEPARATE = '||KREMLING||';
      newSource = newSource.replace(ruleLabel, `k${ruleIndex}${SEPARATE}${kremlingNamespace}${SEPARATE}${css}`);
    }
    callback(null, newSource);
  });

}