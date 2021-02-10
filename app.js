const express = require('express')
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
// const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// const secret = 'Thisisourlittlesecret.'
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('home')
})
app.route('/login')
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {
        const UserEmail = req.body.username
        const password = req.body.password
        User.findOne({ email: UserEmail }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                if (data) {
                    if (data.password === password) {
                        res.render('secrets')
                    }
                }
            }
        })
    })

app.route('/register')
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        const UserEmail = req.body.username
        const password = req.body.password

        const newUser = new User({
            email: UserEmail,
            password: password
        })
        newUser.save((err) => {
            if (!err) {
                console.log("No Error");
                res.render("secrets");
            } else {
                console.log(err)
            }
        })
    })

app.listen(process.env.PORT || 8000, () => {
    console.log("server is running");
})