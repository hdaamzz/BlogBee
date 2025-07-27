const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NG_APP_API_URL': JSON.stringify(process.env.NG_APP_API_URL || 'http://localhost:5000/api'),
        'NG_APP_BASE_URL': JSON.stringify(process.env.NG_APP_BASE_URL || 'http://localhost:5000'),
      }
    })
  ]
};