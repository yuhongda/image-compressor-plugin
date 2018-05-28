import 'babel-polyfill'
import 'babel-register'
var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageCompressorPlugin = require('..');

module.exports = {
    entry: {
        app: ['babel-polyfill','./example/app.js'],
        vendor: ['vue']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].[hash:12].js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            'scss': 'vue-style-loader!css-loader?-autoprefixer!sass-loader!postcss-loader',
                            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                            js: 'babel-loader?presets[]=es2015&presets[]=stage-2'
                        }
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-2']
                    }
                },

            },
            {
                test: /\.(jpeg|jpg|png|gif)$/i,
                use: [
                    `url-loader?limit=10000&name=${ 'example/images/[name].[ext]' }`,
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: false, //process.env.NODE_ENV === 'production',
                            gifsicle: {
                                interlaced: false
                            },
                            mozjpeg: {
                                progressive: true,
                                arithmetic: false
                            },
                            optipng: false, // disabled
                            pngquant: {
                                floyd: 0.5,
                                speed: 2
                            },
                            svgo: {
                                plugins: [
                                    { removeTitle: true },
                                    { convertPathData: false }
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
}

module.exports.plugins = [
    new ImageCompressorPlugin({
        key: 'vmnT6A7UqOFjBONxBS2Z278yqE-HKPFD',
        ext: ['png', 'jpeg', 'jpg']
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendors.min.js',
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './example/index-template.html',
        inject: 'true'
    })
];

module.exports.devtool = 'source-map'