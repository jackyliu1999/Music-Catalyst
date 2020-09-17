const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sdffs#@$%#RFDFSs",
    database: "myapp"
});

new LoginForum(app, db);
