const kremlingJsLoader = require('./kremling-inline-loader');

describe('kremling-js-loader', function () {

  test('should add kremling attributes', () => {
    const style = `krem\`.name { background-color: red }\``;
    const result = `krem\`\${'kremling'}\${'k0'}[kremling="k0"] .name,[kremling="k0"].name { background-color: red }\``;
    expect(kremlingJsLoader(style)).toEqual(result);
  });

  test('should handle template literal placeholders', () => {
    const red = true;
    const style = `krem\`.name { background-color: ${red ? 'red' : 'blue'}; }\``;
    const result = `krem\`\${'kremling'}\${'k1'}[kremling="k1"] .name,[kremling="k1"].name { background-color: ${red ? 'red' : 'blue'}; }\``;
    expect(kremlingJsLoader(style)).toEqual(result);
  });

  test('should handle deeply nested template literal placeholders', () => {
    const red = true;
    const style = `krem\`.name { background-color: ${red ? 'red' : `b${`lue` || `rown`}`}; }\``;
    const result = `krem\`\${'kremling'}\${'k2'}[kremling="k2"] .name,[kremling="k2"].name { background-color: ${red ? 'red' : `b${`lue` || `rown`}`}; }\``;
    expect(kremlingJsLoader(style)).toEqual(result);
  });

  test('should handle template literals and placeholders on many lines', () => {
    const red = true;
    const style = `
      krem\`
        .name {
          background-color: ${red
            ? 'red'
            : 'blue'};
        }
      \`
    `;
    const result = `
      krem\`\${'kremling'}\${'k3'}
        [kremling="k3"] .name,[kremling="k3"].name {
          background-color: ${red
            ? 'red'
            : 'blue'};
        }
      \`
    `;
    expect(kremlingJsLoader(style)).toEqual(result);
  });

});