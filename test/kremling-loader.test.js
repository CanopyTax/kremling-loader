const compiler = require('./compiler');

describe('kremling-loader', () => {
  test('should asdf output a valid es module', async () => {
    expect(!!await run('add-selector.css')).toBe(true);
  });

  test('should prepend all selectors with kremling selector', async () => {
    const result = '[kremling="p1"] .a,[kremling="p1"].a{}';
    expect((await run('add-selector.css')).styles).toBe(result);
  });

  test('should reverse order of the first selector if the selector is not a class or id', async () => {
    const result = '[kremling="p2"] [title],[title][kremling="p2"]{}';
    expect((await run('reverse-order-selectors.css')).styles).toBe(result);
  })

  test('should build kremling selectors from multiple css selectors', async () => {
    const result = '[kremling="p3"] .okay,[kremling="p3"] input,[kremling="p3"].okay,input[kremling="p3"] { background-color: red; }';
    expect((await run('multiple-selectors.css')).styles).toBe(result);
  });

  test('should use namespace from webpack options', async () => {
    const result = `[pizza="p4"] .okay,[pizza="p4"].okay {background-color: red;}`;
    expect((await run('namespace.css', { namespace: 'pizza' })).styles).toBe(result);
  });

  test('should allow double and single quotes without blowing up', async () => {
    expect(!!await run('double-single-quotes.css')).toBe(true);
  });

  test('should use postcss plugins from webpack config options', async () => {
    const output = (await run('config-options.css', {
      postcss: {
        plugins: {
          autoprefixer: { overrideBrowserslist: ['chrome 30'] }
        },
      }
    }));
    expect(output.styles.indexOf('-webkit-transform') > -1).toBe(true);
  });
});

function parseEsModuleString(str) {
  if (str.indexOf('module.exports = ') !== 0) return false;
  const toParse = `(${str.substring(0, str.length - 1).slice(16).trim()})`;
  return eval(toParse);
}
async function run(file, opts = {}) {
  const stats = await compiler(file, opts);
  return parseEsModuleString(stats.toJson({ source: true }).modules[0].source);
}