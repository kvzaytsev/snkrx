var Webpack = require('webpack');

module.exports = {
    devtools: 'inline-source-map',
    entry: "./src/snake.js",
    output: {
        path: './dist',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            }
        ]
    }
};