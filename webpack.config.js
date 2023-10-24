 
const cfg = require("./config");
const path = require("path"); 
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pages = cfg.pages;

module.exports = { 

    // Main files
    entry: pages.reduce((obj, page) => {
        obj[page] = `${cfg.SRC}/pages/${page}/index.js`; 
        return obj;
    }, {}),

    // Production or development
    mode: process.env.NODE_ENV, 

    // When start a dev server
    devServer: {
        contentBase: cfg.DIST,
        publicPath: "/p",
        port: cfg.PORT,
        host: "localhost",
    },
    
    optimization: {
        splitChunks: {
          chunks: "all",
        },
    },

    // main export file
    output: {
        path: cfg.DIST,
        filename: "[name].js",
    }, 
    
    // html export
    plugins: [].concat(
        pages.map(
          (page) =>
            new HtmlWebpackPlugin({
              template: "./public/index.html",
              publicPath: "/p",
              filename: `${page}.html`,
              chunks: [page],
            })
        )
      ),
    
    resolve: {
        // alias imports
        alias: {
            "ui": cfg.SRC + "/ui",
            "utils": cfg.SRC + "/utils",
            "styles": cfg.SRC + "/styles",
            "assets": cfg.SRC + "/assets",
            "gl": cfg.SRC + "/pages/game/gl",
            "engine": cfg.SRC + "/pages/game/engine",
           
            // programming in mobile apps 
            "eruda": cfg.isProduction ?  
                cfg.SRC + "/utils/__eruda-fake.js" : // remove eruda in production 
                "eruda",
        },
        extensions: [".*", ".js", ".jsx"]
    },
    
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },
            {
                test: /\.(css)$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(jpg|png|aac|mp3)$/i,
                type: "asset",
            },
        ],
    },
};