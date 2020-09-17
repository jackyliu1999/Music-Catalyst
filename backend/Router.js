const bcrypt = require("bcrypt");
const { request } = require("express");
class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.register(app, db);
        this.insertdata(app, db);
        this.displayData(app, db);
        this.deleteData(app, db);
    }

    login(app, db) {
        app.post("/login", (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            username = username.toLowerCase();
            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: "Username/Password too long"
                })
                return
            }
            let cols = [username];
            db.query("SELECT * FROM user WHERE username = ? LIMIT 1", cols, (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "Error"
                    })
                    return;
                }
                if (data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
                        if (verified) {
                            req.session.userID = data[0].id;
                            res.json({
                                success: true,
                                username: data[0].username
                            })
                            return;
                        }
                        else {
                            res.json({
                                success: false,
                                msg: "invalid password"
                            })
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "user not found"
                    })
                }
            });
        })
    }

    displayData(app, db) {
        app.post("/displayData", (req, res) => {
            let username = req.body.username;
            let cols = [username];
            db.query("SELECT arr FROM user WHERE username = ? LIMIT 1", cols, (err, data, fields) => {
                var x = data[0].arr
                x = JSON.parse(x)
                res.json({
                    array1: x
                })
            });
        });
    }
    logout(app, db) {
        app.post("/logout", (req, res) => {
            if (req.session.userID) {
                req.session.destroy();
                res.json({
                    success: true
                })
                return true;
            }
            else {
                res.json({
                    success: false
                })
                return false;
            }
        });
    }

    insertdata(app, db) {
        app.post("/doInsertData1", (req, res) => {
            let username = req.body.username;
            let cols = [username];
            db.query("SELECT arr FROM user WHERE username = ? LIMIT 1", cols, (err, result, fields) => {
                if (result[0].arr != "null")
                {
                var insertIntoThis = result[0].arr;
                var obj = JSON.parse(insertIntoThis)
                let sql = 'UPDATE user SET arr = ? WHERE username = ?';
                var x = [req.body.item1,req.body.item2, req.body.item3];
                obj.arr.push(x)
                var myJSON = JSON.stringify(obj);
                let data = [myJSON, req.body.username]
                var obj = JSON.parse(myJSON);
                db.query(sql, data, (err, result) => {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                });
            }
            else
            {
                let sql = 'UPDATE user SET arr = ? WHERE username = ?';
                var y = [req.body.item1,req.body.item2, req.body.item3];
                y = {"arr":[y]}
                var myJSON = JSON.stringify(y);
                let data = [myJSON, req.body.username]
                db.query(sql,data, (err, result) => {
                    if (err) throw err;
                });
            }
              }); //end of db query get all
        });
    }

    deleteData(app, db){
        app.post("/doClear", (req, res) => {
            let username = req.body.username;
            let cols = [username];
            db.query("SELECT arr FROM user WHERE username = ? LIMIT 1", cols, (err, result, fields) => {
                let sql = 'UPDATE user SET arr = ? WHERE username = ?';
                let data = ["null", req.body.username]
                db.query(sql,data, (err, result) => {
                    if (err) throw err;
                });
            });
        });
    }

    isLoggedIn(app, db) {
        app.post("/isLoggedIn", (req, res) => {
            if (req.session.userID) {
                let cols = [req.session.userID];
                db.query("SELECT * FROM user WHERE id = ? LIMIT 1", cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            username: data[0].username
                        })
                        return true;
                    }
                    else {
                        res.json({
                            success: false
                        })
                    }
                });
            }
            else {
                res.json({
                    success: false
                })
            }
        });
    }

    register(app, db) {
        app.post("/register", (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            username = username.toLowerCase();
            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: "Username/Password too long"
                })
                return
            }
            let cols = [username];
            db.query("SELECT * FROM user WHERE username = ? LIMIT 1", cols, (err, data, fields) => {
                if (data && data.length === 1) { //if user is already in database then print error msg
                    res.json({
                        success: false,
                        msg: "User is already registered."
                    })
                    return false;
                }
                else {
                    var sql = "INSERT INTO user (username, password, arr) VALUES ?";
                    const insertUser = 'INSERT INTO user (username, password, arr) VALUES(?, ?, ?)'
                    let pswrd = bcrypt.hashSync(password, 9); //encrypt password with bcrypt
                    db.query(insertUser,
                        [username, pswrd, "null"], (err, result) => {
                            if (err) throw err;
                        });
                    res.json({
                        success: true,
                        msg: "User has been registered. You may now log in." //displays message if user is registered successfully
                    })
                }
            });

        })
    }
}


module.exports = Router;