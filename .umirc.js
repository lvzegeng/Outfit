import { resolve } from 'path';

// ref: https://umijs.org/config/
export default {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : `file://${__dirname}/dist/`,
  history: 'hash',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false, // 设为 true 会导致 css 热加载无效
        title: 'electron-',
        dll: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /components\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
          ],
        },
        hardSource: true,
      },
    ],
  ],
  chainWebpack(config, { webpack }) {
    config.target('electron-renderer');
  },
  alias: {
    '@components': resolve(__dirname, 'src/components'),
    '@utils': resolve(__dirname, 'src/utils'),
    '@assets': resolve(__dirname, 'src/assets'),
  },
};
