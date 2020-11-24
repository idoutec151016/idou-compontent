module.exports = {
  css: { extract: false },
  publicPath: './',
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 2000000 }))
  }
}