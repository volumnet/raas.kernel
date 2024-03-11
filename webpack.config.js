const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations');

const config = {
    mode: 'production',
    entry: {
        header: './public/src/header.js',
        application: './public/src/application.js',
        'ckeditor.config': './public/src/ckeditor.config.js'
    },
    resolve: {
        modules: ['node_modules'],
        alias: {
            app: path.resolve(__dirname, 'public/src/'),
            // css: path.resolve(__dirname, 'dev/css/'),
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery'),
            cms: path.resolve(__dirname, 'd:/web/home/libs/raas.cms/resources/js'),
            // shop: path.resolve(__dirname, 'vendor/volumnet/raas.cms.shop/resources/js'),
            // users: path.resolve(__dirname, 'vendor/volumnet/raas.cms.users/resources/js'),
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
        path: __dirname+'/public',
        publicPath: '/vendor/volumnet/raas.kernel/public/',
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({ 
                terserOptions: { output: { comments: false, }}
            }), 
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: [
                        'default', 
                        { discardComments: { removeAll: true }}
                    ],
                },
            }),
        ],
    },
    externals: {
        knockout: 'knockout',
        jquery: 'jQuery',
        // vue: 'vue',
        $: 'jquery',
        'window.jQuery': 'jquery',
    },
    // devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                use: [ 'raw-loader' ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true
                            } )
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                use: [
                    // 'vue-style-loader',
                    // 'style-loader',
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader", options: {url: false}, },
                    'stylus-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // 'vue-style-loader',
                    // 'style-loader',
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader", options: {url: false}, },
                    // {
                    //   loader: 'postcss-loader', // Run postcss actions
                    //   options: {
                    //     plugins: function () { // postcss plugins, can be exported to postcss.config.js
                    //       return [
                    //         require('autoprefixer')
                    //       ];
                    //     }
                    //   }
                    // },
                    {
                        loader: "sass-loader",
                        options: {
                            additionalData: "@import 'app/_shared/init.scss';\n",
                        },
                    },
                ]
            },
            {
                test: { and: [ /\.css$/, { not: [/ckeditor5-/] } ] },
                use: [
                    // 'style-loader',
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader", options: {url: false}, },
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: { and: [ /\.(png|svg|jpg|jpeg|gif)$/, { not: [/ckeditor5-/] } ] },
                loader: 'file-loader',
                options: { 
                    outputPath: './img', 
                    name: '[name].[ext]', 
                }
            },
            {
                test: { and: [ /(\.(woff|woff2|eot|ttf|otf))|(font.*\.svg)$/, { not: [/ckeditor5-/] } ] },
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
        // new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({ filename: './[name].css' }),
        new CKEditorTranslationsPlugin( {
            language: 'en',
            additionalLanguages: ['ru'],
            buildAllTranslationsToSeparateFiles: true,
        } ),
    ]
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
    }

    if (argv.mode === 'production') {
        //...
    }

    return config;
};