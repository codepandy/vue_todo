### 描述

使用 webpack 和 vue 手动写一个 todo 的 demo。

### 环境搭建

初始化项目

```
npm init -y
```

安装相关包

```
npm i -D vue vue-loader vue-template-compiler css-loader webpack webpack-cli
```

> 上面这些包是配合 webpack 开发 vue 最基本的包；`vue-template-compiler`用于模板编译。css-loader 是 vue 需要的，所以直接安装上。

安装生成 html 模板的插件,并在 plugin 中配置

```
npm i -D html-webpack-plugin
```

在 package.json 文件中配置打包命令

```
"build":"webpack"
```

安装 webpack-dev-server,启动项目,快速开发

```
npm i -D webpack-dev-server
```

在 package.json 中配置启动命令

```
"start":"webapck-dev-server"
```

### webpack 的设置

在根目录创建 webpack.config.js 文件，设置入口、出口文件，配置 dev-server 的参数，设置 loader 等等

到目前为止，就可以进行基本的 vue 开发了。下面会安装一些插件或 plugin 来帮助更好的开发 vue。

> 在命令行中执行 webpack 命令和通过 script 命令的方式有什么不同呢？
> 在命令行中执行 webpack 命令调用的是全局安装的 webpack，通过 script 命令调用的 wbpack 是在项目中安装的 webpack，为什么防止全局安装的 webpack 和项目中安装的不一致，建议通过 script 命令调用 webpack。

### 环境变量的设置

在开发环境和生产环境中，由于用到的打包配置不同，所以通过环境变量来去区分是生产环境还是开发环境，当然也可以设置一些其他参数。但是在 window 上和 mac 上设置环境变量的方式不同，所以我们需借助`cross-env`插件来设置

```
npm i -D cross-env
```

在 package.json 中配置环境变量

```
"start": "cross-env NODE_ENV=development webpack-dev-server"
```

**如果在页面中使用环境变量呢？**

```
    // 定义在js中可以访问的全局变量
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
```

通过上面 plugin 的配置，就可以在页面中通过 js 来访问设置的环境变量了。

**源码映射**

```
config.devtool = "#cheap-module-eval-source-map";
```

### 样式先关 loader

现在写样式有很多 css 的预处理器，所以安装什么 loader 看你喜欢什么预处理器。我喜欢使用 less，所以需要安装 less、less-loader,另外需要 style-loader，由于 css-loader 已经安装过，就不要再安装

```
npm i -D less less-loader style-loader
```

- 安装 less 是为了支持 less 语法
- less-loader 是编译 less 文件成 css
- css-loader 是将 css 中的`@import`和`url()`解释成`import/require()`；就是模块化
- style-loader 是将 css 以内联的方式插入页面中

### 文件相关 loader

```
npm i -D url-laoder file-loader
```

对图片的处理
`url-loader`依赖`file-loader`

### 使用 jsx 的配置

由于 vue 对 jsx 的支持不是很友好，所以他发明了自己组件的开发方式。但是 vue 也可以使用 jsx 开发。
首先安装相关插件

```
npm i -D babel-loader @babel/core babel-preset-env babel-plugin-transform-vue-jsx
```

安装完后，创建 babel 的配置文件`.babelrc`,`babel-preset-env`就是方面设置 babel 把 js 编译成什么环境的代码。`babel-plugin-transform-vue-jsx`是用来转义 vue 的 jsx。配置 loader，可以支持 jsx 文件。

> @somescope/somepackagename
> https://docs.npmjs.com/misc/scope

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

> commons 设置共用的自定义组件，vendors 设置把 node_modules 的打包成公共模块。
