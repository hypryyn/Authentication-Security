const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require("md5");
require('dotenv').config();

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
    .then(() => console.log('Connected to MongoDB!'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

// app.get("/logout", function(req, res){
//     req.logout();
//     res.redirect("/");
//   });

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
        .then(function () {
            res.render("secrets")
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        })
        .catch(err => {
            console.log(err);
        });
});


app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});