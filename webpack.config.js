const path = require('path');

const config = {};

config.entry = path.resolve(__dirname, 'dev-env/index.js');
config.output = {
  path: path.resolve(__dirname, 'dev-env'),
  filename: 'bundle.js',
};
config.mode = 'development';
config.module = {
  rules: [
    {
      test: /\.css$/,
      use: [
        {
          loader: path.resolve(__dirname, 'index.js'),
          options: {
            plugins: {
              'autoprefixer': {},
              'cssnano': {},
            },
          },
        },
      ],
    }
  ],
}

module.exports = config;