module.exports = {
  configureWebpack: {
    resolve: {
      /*extension: [], // 后缀*/
      alias: {
        '@': 'src',
        'assets': 'src/assets',
        'common': 'src/common',
        'components': 'src/components',
        'network': 'src/network',
        'views': 'src/views',
      }
    }
  }
}