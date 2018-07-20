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
      expect(parseEsModuleString(result).styles).toBe('.krem_id_1.a,.krem_id_1 .a{}');
      done();
    })
  });

  test('should reverse order of the first selector if it doesn\'t start with . or #', done => {
    mockKremlingLoader.run('[title]{}', result => {
      expect(parseEsModuleString(result).styles).toBe('[title].krem_id_1,.krem_id_1 [title]{}');
      done();
    });
  })

  test('should build kremling selectors from multiple css statements', done => {
    const css = `
      .wow,
      .someRule {
        background-color: red;
      }

      .oliver,
      .cromwell {
        background-color: green;
      }`;

    const newCss = `
      .krem_id_1.wow,.krem_id_1 .wow,.krem_id_1.someRule,.krem_id_1 .someRule {
        background-color: red;
      }

      .krem_id_1.oliver,.krem_id_1 .oliver,.krem_id_1.cromwell,.krem_id_1 .cromwell {
        background-color: green;
      }`;
      mockKremlingLoader.run(css, result => {
        expect((parseEsModuleString(result).styles).trim()).toEqual(newCss.trim());
        done();
      });
  });
});