const { dirname, resolve } = require('path');

const config = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [
                    resolve(__dirname, './node_modules/monaco-editor'),
                    resolve(__dirname, './node_modules/vscode')
                ]
            },
            {
                test: /\.(mp3|wasm|ttf)$/i,
                type: 'asset/resource'
            }
        ],
        parser: {
            javascript: {
                url: true
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.ttf']
    }
};

module.exports = config;
