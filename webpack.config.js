const path              = require('path');
const webpack           = require('webpack');
const nodeExternals     = require('webpack-node-externals');
const StartServerPlugin = require('start-server-nestjs-webpack-plugin');

module.exports = {
    mode: 'development',
    //context: path.resolve(__dirname, '../'),
    entry: [
            "webpack/hot/poll?1000",
            "./app.js"
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.web.js',
        publicPath: 'http://localhost:8000'
    },
    watch: true,
    target: "node",
    node: {
        __dirname: true,
        __filename: true
    },
    externals: [nodeExternals({
        whitelist: ['webpack/hot/poll?1000']
    })],
    plugins:[
        new StartServerPlugin('bundle.web.js'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin(
            {
                paths: [path.resolve(__dirname, 'build')]
            })
    ],
    module:{
        noParse: [
            new RegExp('^jquery$')
        ],
        rules: [
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            //Babel loader converts jsx (html embedded jsx) to browser-friendly js
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    optimization:{
        moduleIds: "named"
    }
};
