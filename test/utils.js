exports.parseEsModuleString = function(str) {
  // make sure this is an es module
  if (str.indexOf('export default') !== 0) return false;
  const toParse = `(${str.substring(0, str.length - 1).slice(15).trim()})`;
  return eval(toParse);
}
