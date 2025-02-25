const path = require('path');

const config = require('./webpack.config.inc.js');

config.entry = {
    header: path.resolve('./public/src/header.js'),
    application: path.resolve('./public/src/application.js'),
    'ckeditor.config': path.resolve('./public/src/ckeditor.config.js')
};
config.output.publicPath = '/vendor/volumnet/raas.kernel/public/';
config.module.rules.push({
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
});

module.exports = config;