const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  context: process.cwd(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'monitorSDK.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    // 模拟请求
    before(router) {
      router.get('/success', function (req, res) {
          res.json({ 
            code: 0,
            success: true,
            data: {}
          });
      });
      router.post('/error', function (req, res) {
          res.sendStatus(500);
      });
    }
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'head', // 插入到头部，先于其他脚本执行
    })
  ]
}