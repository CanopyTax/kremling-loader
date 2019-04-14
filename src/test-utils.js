exports.parseEsModuleString = function(str) {
  // make sure this is an es module
  if (str.indexOf('module.exports = ') !== 0) return false;
  const toParse = `(${str.substring(0, str.length - 1).slice(16).trim()})`;
  return eval(toParse);
}

exports.webpackMock = function(loader) {
  this.test = null;
  this.async = () => (err, result) => {
    return this.test(result);
  };
  this.loader = loader;
  this.run = (source, options, test) => {
    if (options) this.query = `?${JSON.stringify(options)}`;
    this.test = test;
    this.loader(source);
  };
}