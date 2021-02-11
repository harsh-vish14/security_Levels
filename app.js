require('dotenv').config();
const express = require('express')
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express()

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('home')
})
app.route('/login')
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {

        // console.log(password)
        User.findOne({ email: req.body.username }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                if (data) {
                    bcrypt.compare(req.body.password, data.password, function (err, result) {
                        if (result === true) {
                            res.render('secrets')
                        } else {
                            res.redirect("/login");
                        }
                    });
                } else {
                    console.log(data)
                }
            }
        })
    })

app.route('/register')
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        console.log(req.body.password);
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            })
            newUser.save((err) => {
                if (!err) {
                    console.log("No Error");
                    res.render("secrets");
                } else {
                    console.log(err)
                }
            })
        });
    })

app.listen(process.env.PORT || 8000, () => {
    console.log("server is running");
})