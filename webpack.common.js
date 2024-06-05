const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.tsx', '.js', 'jsx', 'json'],
    },
    target: ['web', 'es5'],
    plugins: [
        new HtmlWebpackPlugin({
            files: {
                css: ['style.css'],
            },
            minify: {
                removeRedundantAttributes: false, // do not remove type="text"
            },
        }),
        new CopyPlugin({
            patterns: [{ from: 'public/assets', to: 'public/assets' }, { from: 'src/style.css' }],
        }),
        new NodePolyfillPlugin(),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
    ],
}
