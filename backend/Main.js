const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const MYSQLStore = require("express-mysql-session")(session);
const Router = require("./Router");
const MySQLStore = require("express-mysql-session");

app.use(express.static(path.join(__dirname,"build")));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "myapp"
});

db.connect(function(error){
    if (error){
        console.log("DB Error");
        throw error;
        return false;
    }
});

const sessionStore = new MySQLStore({
    expiration: (8*60*60*1000),
    endConnectionOnClose:false
}, db);

app.use(session({
    key: "key",
    secret: "secret",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge:(8*60*60*1000),
        httpOnly: false
    }
}));

new Router(app, db);

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "build", "index.html"))
});

app.listen(3000);