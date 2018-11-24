
// ref: https://umijs.org/config/
export default {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : `file://${__dirname}/dist/`,
  history: 'hash',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: true,
      title: 'electron-',
      dll: true,
      routes: {
        exclude: [],
      },
      hardSource: true,
    }],
  ],
  chainWebpack(config, { webpack }) {
    config.target('electron-renderer');
  },
};
