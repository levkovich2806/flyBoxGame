const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "main.js",
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".ts", ".tsx", ".js", "jsx", "json"],
    },
    target: ["web", "es5"],
    plugins: [
        new HtmlWebpackPlugin({
            // template: './src/index.ejs',
            "files": {
                "css": [ "style.css" ],
                // "js": [ "assets/head_bundle.js", "assets/main_bundle.js"],
                // "chunks": {
                //     "head": {
                //         "entry": "assets/head_bundle.js",
                //         "css": [ "main.css" ]
                //     },
                //     "main": {
                //         "entry": "assets/main_bundle.js",
                //         "css": []
                //     },
                //     "body": {
                //         "entry": "../dist/main.js"
                //     }
                // }
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: "public/assets", to: "public/assets" },
                { from: "src/style.css"},
            ],
        }),
    ],
};
