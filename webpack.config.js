const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ExtractPlugin = require("extract-text-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

const config = {
  mode: "development",
  entry: path.join(__dirname, "src/index.js"),
  output: {
    filename: "bundle[hash:8].js", // 不能使用chunkhash作为文件名，不然使用dev-server时会报错
    path: path.join(__dirname, "dist/")
  },
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      { test: /\.jsx/, use: ["babel-loader"] },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: { limit: 1024, name: "[name]-wenmu.[ext]" }
          }
        ]
      }
    ]
  },
  plugins: [
    // 定义在js中可以访问的全局变量
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin()
  ]
};

if (isDev) {
  config.module.rules.push({
    test: /\.less$/,
    use: [
      "style-loader",
      {
        loader: "css-loader"
      },
      "less-loader"
    ]
  });
  config.devtool = "#cheap-module-eval-source-map";
  config.devServer = {
    port: 8000,
    host: "0.0.0.0",
    overlay: {
      errors: true
    },
    hot: true,
    open: true
  };
} else {
  //   config.entry = {
  //     app: path.join(__dirname, "src/index.js"),
  //     vendor: ["vue"]
  //   };
  /**
   * 在正式环境要用chunkhash值当文件的名称。
   */
  config.output.filename = "[name].[chunkhash:8].js";
  /**
   * extract的use为什么要删除掉style-loader?
   * 因为style-loader是把css-loader生成的css代码用js包装了一下，
   * 这样就能插入js文件中，但是我们是为什么把css单独打包，所以loader到css-loader就行了
   * fallback是当css没有被提取时则使用这个laoder进行处理。
   */
  config.module.rules.push({
    test: /\.less$/,
    use: ExtractPlugin.extract({
      fallback: "style-loader",
      use: ["css-loader", "less-loader"] // 注意：不包含style-loader
    })
  });
  config.plugins.push(
    new ExtractPlugin("styles.[hash:8].css")
    // 下面方式已过期
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor"
    // })
  );
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 1,
          minSize: 0
        }
      }
    }
  };
}

module.exports = config;
