/* eslint no-var:0 */
'use strict';

var webpack = require('webpack');

var plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
];

var entry = ['webpack/hot/dev-server', './test/debug'];
plugins.push(new webpack.HotModuleReplacementPlugin());
plugins.push(new webpack.NoErrorsPlugin());

module.exports = {
    entry: entry,
    devtool: 'eval',
    output: {
        filename: 'client.js'
    },
    module: {
        loaders: [
            { 
                test: /\.jsx?$/, 
                exclude: /(d3|node_modules)/,
                loader: 'babel' 
            },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
