const TerserJSPlugin = require('terser-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const glob = require('glob');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        application: './public/src/application.js'
    },
    resolve: {
        modules: ['node_modules'],
        alias: {
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery'),
            "./dependencyLibs/inputmask.dependencyLib": "./dependencyLibs/inputmask.dependencyLib.jquery"
        },
        extensions: [
            '.styl',
            '.js',
            '.vue',
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname+'/public'
    },
    externals: {
        knockout: 'knockout',
        jQuery: 'jquery',
        $: 'jquery',
        'window.jQuery': 'jquery',
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({ 
                terserOptions: { output: { comments: false, }}
            }), 
        ],
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                loader: 'file-loader',
                options: { 
                    outputPath: './img', 
                    name: '[name].[ext]', 
                }
            },
            {
                test: /(\.(woff|woff2|eot|ttf|otf))|(font.*\.svg)$/,
                loader: 'file-loader',
                options: { 
                    outputPath: './fonts', 
                    name: '[name].[ext]',
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: require.resolve('bootstrap-multiselect/dist/js/bootstrap-multiselect'),
                use: [
                    {
                        loader: 'imports-loader',
                        options: {
                            imports: {
                                moduleName: 'jquery',
                                name: '$',
                            },
                            additionalCode: 'var define = false; /* Disable AMD for misbehaving libraries */',
                            wrapper: 'window',
                        },
                    }
                ],
            },
            
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            knockout: 'knockout',
            // $: 'jquery',
            // jQuery: 'jquery',
            // 'window.jQuery': 'jquery',
        }),
        new VueLoaderPlugin(),
        new FixStyleOnlyEntriesPlugin(),
    ]
}