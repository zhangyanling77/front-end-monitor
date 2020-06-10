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
    // 配置后端路由的  内部启动了express
    before(router) {
      router.get('/success', function (req, res) {
          res.json({ 
            success: true,
            data: {}
          });
      });
      router.post('/fail', function (req, res) {
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
