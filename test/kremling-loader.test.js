const kremlingId = require('../src/kremling-id');
const { parseEsModuleString, webpackMock } = require('./utils');

const mockKremlingLoader = new webpackMock();

describe('kremling-loader', () => {
  beforeEach(() => {
    kremlingId.id = 0;
  });

  test('should output a valid es module', done => {
    mockKremlingLoader.run('.a{}', null, result => {
      expect(!!parseEsModuleString(result)).toBe(true);  
      done();
    });
  });

  test('should prepend all selectors with kremling selector', done => {
    mockKremlingLoader.run('.a{}', null, result => {
      expect(parseEsModuleString(result).styles).toBe('[data-kremling="1"] .a,[data-kremling="1"].a{}');
      done();
    })
  });

  test('should reverse order of the first selector if the selector is not a class or id', done => {
    mockKremlingLoader.run('[title]{}', null, result => {
      expect(parseEsModuleString(result).styles).toBe('[data-kremling="1"] [title],[title][data-kremling="1"]{}');
      done();
    });
  })

  test('should build kremling selectors from multiple css statements', done => {
    const css = `
      .okay,
      input {
        background-color: red;
      }`;

    const newCss = '[data-kremling="1"] .okay,[data-kremling="1"] input,[data-kremling="1"].okay,input[data-kremling="1"] { background-color: red; }';
      mockKremlingLoader.run(css, null, result => {
        expect((parseEsModuleString(result).styles).trim()).toEqual(newCss.trim());
        done();
      });
  });

  test('should use namespace from webpack options', done => {
    const css = `
      .okay {background-color: red;}
    `;
    const newCss = `[pizza="1"] .okay,[pizza="1"].okay {background-color: red;}`
    const options = { namespace: 'pizza' };
    mockKremlingLoader.run(css, options, result => {
      const resultObj = parseEsModuleString(result);
      expect((resultObj.styles).trim()).toEqual(newCss.trim());
      expect(resultObj.namespace).toEqual(options.namespace);
      done();
    });
  });

  test('should allow double and single quotes without blowing up', done => {
    const css = `
      .okay {
        content: '';
        content: "";
      }
    `;
    mockKremlingLoader.run(css, null, result => {
      expect(!!parseEsModuleString(result).styles).toBe(true)
      done();
    });
  });

  test('should use postcss plugins from webpack config options', done => {
    const css = `
      .okay {
        transform: scale(2);
      }
    `;
    const options = {
      postcss: {
        plugins: {
          autoprefixer: {}
        },
      },
    };
    mockKremlingLoader.run(css, options, result => {
      const resultObj = parseEsModuleString(result);
      expect(resultObj.styles.indexOf('-webkit-transform') > -1).toBe(true);
      done();
    });
  });
});