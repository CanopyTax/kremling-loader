const kremlingInlineLoader = require('./kremling-inline-loader');
const { webpackMock } = require('./test-utils');

const mockKremlingLoader = new webpackMock(kremlingInlineLoader);

describe('kremling-loader', () => {
  test('should prepend all selectors with kremling selector', done => {
    const test = 'const test = k`a{}`';
    const result = '[kremling="k0"] a,a[kremling="k0"]{}';
    mockKremlingLoader.run(test, null, output => {
      expect(output).toBe(`const test = k\`0||KREMLING||kremling||KREMLING||${result}\``);
      done();
    })
  });

  test('should output kremling separators', done => {
    const test = 'const test = k`a{}`';
    const result = '[kremling="k1"] a,a[kremling="k1"]{}';
    mockKremlingLoader.run(test, null, output => {
      const match = output.match(/`(.*)`/)[0];
      const [id, namespace, styles] = `${match.slice(1, match.length - 1)}`.split('||KREMLING||');
      expect(id).toEqual('1');
      expect(namespace).toEqual('kremling');
      expect(styles).toEqual(result);
      done();
    });
  });
});