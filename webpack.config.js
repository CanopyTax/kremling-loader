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
            namespace: 'custom',
            postcss: {
              plugins: {
                'autoprefixer': {},
                'cssnano': {},
              },
            },
          },
        },
      ],
    }
  ],
}

config.devServer = {
  contentBase: path.resolve(__dirname, 'dev-env')
};

module.exports = config;
