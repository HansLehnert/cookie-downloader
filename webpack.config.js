const path = require("path");
var CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        background: "./src/background.ts",
        content_script: "./src/content_script.ts",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".d.ts", ".tsx", ".ts", ".js"],
        fallback: {
            buffer: require.resolve("buffer/"),
        }
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "manifest.json"},
                {from: "images", to: "images"},
        ]}),
    ]
}
