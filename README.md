### 描述

使用 webpack 和 vue 手动写一个 todo 的 demo。

### 使用 jsx 的配置

### webpack 配置 css 单独分离打包

将 css 和 js 都打包在一起， 浏览器缓存起来比较大，性能不好，并且浪费资源。
接下来讲解如何把 css 单独拿出来，打包成单独 css 文件。
安装`extract-text-webpack-plugin`

```
npm i -D extract-text-webpack-plugin
```

这个工具包就是帮助我们把非 js 的 text 打包成单独的静态资源文件。 这样就可以通过页面头部的方法引用外部 css 文件。
webpack.config.js 文件做如下修改：

1. 删除掉`module.rules`中对 css 相关的配置，我用的 less
2. 当是开发环境时，把上面删除的配置添加上去
3. 配置正式环境相关参数

关键代码：

```
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
 ...
}else{
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
  config.plugins.push(new ExtractPlugin("styles.[contenthash:8].css"));
}
```

### Error:Tapable.plugin is deprecated

> Tapable.plugin is deprecated. Use new API on `.hooks` instead
> /Users/iss/myself/demos/vue_demo/vue_todo/node_modules/webpack/lib/Chunk.js:857

**解决方法**

```
npm i -D extract-text-webpack-plugin@next
```

安装后还是不行，然后我把生成`css`的`hash`方式改了，把`contenthash`改成`hash`可以了

```
config.plugins.push(new ExtractPlugin("styles.[hash:8].css"));
```

> 最后 vue 文件中的 css 和单独定义的 css 都被打包进行了同一个 css 中。

### 打包类库文件

项目中有一些类库是比较稳定的，并且被多数组件使用，比如 vue、vue-router 等等，这些组件如果每个文件都打包一份比较浪费资源，可以抽出成一个公共的部分，让浏览器尽可能长的去缓存这些静态文件。如何和业务代码打包在一起，那么这些代码也会随着业务代码的更新而更新，这样比较浪费服务器流量。

1. 更改 entry 部分。

```
  // 第一步
  config.entry = {
    app: path.join(__dirname, "src/index.js"),
    vendor: ["vue", "vue-router"] // 列举需要单独打包的包名
  };

  // 第二步，添加如下plugin，该方式已过期
  new webpack.optimize.CommonsChunkPlugin({
      name: "vendor" // 必须和第一步的第二个属性名称一致
  })

  // 配置如下
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  };
```
>commons设置共用的自定义组件，vendors设置把node_modules的打包成公共模块。

