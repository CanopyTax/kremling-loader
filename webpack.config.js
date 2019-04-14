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
          loader: path.resolve(__dirname, 'src', 'kremling-loader.js'),
          options: {
            namespace: 'custom',
            postcss: {
              plugins: {
                'autoprefixer': {},
                // 'cssnano': {},
              },
            },
          },
        },
      ],
    },
    {
      test: /\.js$/,
      use: [
        {
          loader: path.resolve(__dirname, 'src/kremling-inline-loader.js'),
          options: {
            namespace: 'super-custom',
            postcss: { plugins: { autoprefixer: {} } },
          },
        },
      ],
    },
  ],
}

module.exports = config;