const fs = require('fs');

module.exports = {
    lintOnSave: true,
    // configureWebpack: {
    //     output: {
    //         path: __dirname + "/foo"
    //     }
    // },
    devServer: {
        disableHostCheck: true
    },
    css: {
        loaderOptions: {
            sass: {
                data: '@import "src/scss/config";'
            }
        }
    },
};
