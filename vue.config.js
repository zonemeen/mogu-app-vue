/* eslint-disable */
const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/iMoney/" : "/",
  lintOnSave: false,
  chainWebpack: config => {
    const icons = path.resolve(__dirname, "src", "assets", "icons");
    // 配置loader
    config.module
      .rule("svg-sprite")
      .test(/\.svg$/)
      .include.add(icons)
      .end() // 仅匹配icons目录
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ extract: false })
      .end()
      .use("svgo-loader")
      .loader("svgo-loader")
      .tap(options => ({
        ...options,
        plugins: [{ removeAttrs: { attrs: "fill" } }]
      }))
      .end(); // 删除svg默认颜色
    // 其他svg相关loader排除icons目录
    config.module.rule("svg").exclude.add(icons);
    // 配置plugin
    config
      .plugin("svg-sprite")
      .use(require("svg-sprite-loader/plugin"), [{ plainSprite: true }]);
  }
};
