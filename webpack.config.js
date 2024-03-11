const path = require("path");

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
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
    },
}
