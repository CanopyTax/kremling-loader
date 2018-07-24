const kremlingLoader = require('../index');
const kremlingId = require('../src/kremling-id');
const { parseEsModuleString } = require('./utils');

function webpackMock() {
  this.test = null;
  this.async = () => (err, result) => {
    return this.test(result);
  };
  this.loader = kremlingLoader;
  this.run = (source, test) => {
    this.test = test;
    this.loader(source);
  };
}
const mockKremlingLoader = new webpackMock();

describe('kremling-loader', () => {
  beforeEach(() => {
    kremlingId.id = 0;
  });

  test('should output a valid es module', done => {
    mockKremlingLoader.run('.a{}', result => {
      expect(!!parseEsModuleString(result)).toBe(true);  
      done();
    });
  });

  test('should prepend all selectors with kremling selector', done => {
    mockKremlingLoader.run('.a{}', result => {
      expect(parseEsModuleString(result).styles).toBe('[data-kremling="1"] .a,[data-kremling="1"].a{}');
      done();
    })
  });

  test('should reverse order of the first selector if the selector is not a class or id', done => {
    mockKremlingLoader.run('[title]{}', result => {
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
      mockKremlingLoader.run(css, result => {
        expect((parseEsModuleString(result).styles).trim()).toEqual(newCss.trim());
        done();
      });
  });
});