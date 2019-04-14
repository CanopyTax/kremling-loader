exports.testKremling = function(src, i, config) {
  const {
    inKremling = false,
    inComment = false,
    inMultiLineComment = false,
    inSingleQuote = false,
    inDoubleQuote = false,
    startArray,
    endArray,
    placeholderDepth,
  } = config;

  // comment
  //-------------------------------
  if (src[i] === '/' && src[i + 1] === '/' && src[i - 1] !== '\\') {
    return {
      ...config,
      inComment: true,
    };
  }
  if (src[i] === '\n' || src[i] === '\r' && src[i] === '\t') {
    return {
      ...config,
      inComment: false,
    };
  }

  // multiline comment
  //-------------------------------
  if (src[i] === '/' && src[i + 1] === '*' && src[i - 1] !== '\\' && !inMultiLineComment && !inKremling) {
    return {
      ...config,
      inMultiLineComment: true,
    };
  }
  if (src[i] === '/' && src[i - 1] === '*' && src[i - 2] !== '\\' && inMultiLineComment && !inKremling) {
    return {
      ...config,
      inMultiLineComment: false,
    };
  }

  // quote
  //-------------------------------
  if (src[i] === '\'' && src[i - 1] !== '\\' && !inSingleQuote && !inKremling) {
    return {
      ...config,
      inSingleQuote: true,
    };
  }
  if (src[i] === '\'' && src[i - 1] !== '\\' && inSingleQuote && !inKremling) {
    return {
      ...config,
      inSingleQuote: false,
    };
  }

  // double quote
  //-------------------------------
  if (src[i] === '"' && src[i - 1] !== '\\' && !inDoubleQuote && !inKremling) {
    return {
      ...config,
      inDoubleQuote: true,
    };
  }
  if (src[i] === '"' && src[i - 1] !== '\\' && inDoubleQuote && !inKremling) {
    return {
      ...config,
      inDoubleQuote: false,
    };
  }

  // placeholder depth
  //-------------------------------
  if (src[i] === '$' && src[i + 1] === '{' && src[i - 1] !== '\\' && inKremling) {
    return {
      ...config,
      placeholderDepth: placeholderDepth + 1,
    };
  }
  if (src[i] === '}' && placeholderDepth > 0 && src[i - 1] !== '\\' && inKremling) {
    return {
      ...config,
      placeholderDepth: placeholderDepth - 1,
    };
  }

  // start kremling
  //-------------------------------
  if (src[i] === 'k' && src[i + 1] === '`' && src[i - 1] !== '\\' && !inMultiLineComment && !inComment && !inSingleQuote && !inDoubleQuote && !inKremling) {
    return {
      ...config,
      startArray: [...startArray, i + 2],
      inKremling: true,
    }
  }

  // end kremling
  //-------------------------------
  if (placeholderDepth === 0 && src[i] === '`' && src[i - 1] !== '\\' && inKremling && i > startArray[startArray.length - 1]) {
    return {
      ...config,
      endArray: [...endArray, i],
      inKremling: false,
    };
  }
  return config;
}



exports.testPlaceholder = function(src, i, config) {
  const {
    startArray,
    endArray,
    placeholderDepth,
  } = config;

  // placeholder depth
  //-------------------------------
  if (src[i] === '$' && src[i + 1] === '{' && src[i - 1] !== '\\') {
    return {
      ...config,
      startArray: placeholderDepth === 0 ? [...startArray, i] : startArray,
      placeholderDepth: placeholderDepth + 1,
    };
  }
  if (src[i] === '}' && src[i - 1] !== '\\') {
    return {
      ...config,
      endArray: placeholderDepth === 1 ? [...endArray, i + 1] : endArray,
      placeholderDepth: placeholderDepth - 1,
    };
  }
  return config;
}