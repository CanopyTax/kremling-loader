if (result.css) {
  const kremlingId = result.css.match(/^.([\w\-]+)/);
  callback(null, `export default '${kremlingId[0]}';`);  
} else {
  callback(null, `export default '';`);
}