// Modules imports
const config = require("../config.js");
const express = require("express");
const sessions = require("express-session");
const app = express();
const server = require("http").Server(app);
const fs = require("fs");
const passport = require("passport");
const router = require("./routes/router.js");
const { User } = require("./helpers/db.js");
var SQLiteStore = require('connect-sqlite3')(sessions);

require("./install.js");
//Google Middleware
require("./middlewares/google.js");
//Facebook Middleware
require("./middlewares/facebook.js");

// Global middlewares
app.use(express.json());
// Session Store
const sessionMiddleware = sessions({
    store: new SQLiteStore,
    secret: 'SECRET_cOOKIE',
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
})
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//Serialize-Deserialize Users
passport.serializeUser(function (user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(async function (id, done) {
    const user = await User.findOne({
        where: {
            user_id: id
        }
    });
    done(null, user);
});
/*
app.use((req, res, next) => {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        Si no está autenticado, redirige al usuario a la ruta '/auth'
        
        return res.redirect('/auth');
    }
    // Si está autenticado, redirige al usuario a la ruta '/game'
    return res.redirect('/game');
});
*/

app.use(router);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["POST", "GET"]
    }
}).use(function (socket, next) {
    // Wrap the express middleware
    sessionMiddleware(socket.request, {}, next);
});

require("./engine/socket.js")(io);

// Start the server and listen on the specified port
server.listen(config.PORT, () => {
    console.log("Running in port " + config.PORT);
});


//
// Serve static pages
//
if (!config.isProduction) {

    // Development mode - Use Webpack server for serving static files
    const webpackRouter = require('./webpack-router');
    const webpackCompiler = webpackRouter.compiler;
    
    app.use("/", (req, res, next) => {
        if (!req.url.endsWith(".html")) return next();
        
        // reject statics html
        res.status(404);
        res.set('content-type', 'text/plain');
        res.send('Cannot GET ' + req.url);
    });
    app.use("/", webpackRouter);

    for (let page of config.pages) {
        app.get(`/${page}`, (req, res) => { 
            webpackCompiler.outputFileSystem.readFile(`./dist/${page}.html`, (err, result) => {
                if (err) console.log(err);
                res.set("content-type", "text/html");
                res.send(result); 
            })
        });
    }

    console.log("Using Webpack server for development mode...");

}
else {
    // Production mode - Use static server for serving static files
    app.use("/p", express.static(config.DIST));

    for (let page of config.pages) {
        app.get(`/${page}`, (req, res) => res.sendFile(config.DIST + "/" + page + ".html"));
    }

    console.log("Using static server for production mode...");
}