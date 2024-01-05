const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Jwt_secret=process.env.JWT_KEY;

router.post("/signup", (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    USER.findOne({ $or: [{ email: email }, { username: username }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exist with that email or username" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new USER({
                name, username, email, password: hashedPassword
            })
            user.save()
                .then(user => {
                    res.json({ message: "saved successfully" })
                })
                .catch(err => { console.log(err) })
        })
    })
})
router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please add email and password" });
    }
    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
                const { _id, name, email, username } = savedUser
                res.json({ token, user: { _id, name, email, username } })
            } else {
                return res.status(422).json({ error: "Invalid password" })
            }
        })
            .catch(err => { console.log(err) })
    })
})
router.post("/googleLogin", (req, res) => {
    const { email_verified, email, name, clientId, username, Photo } = req.body
    if (email_verified) {
        USER.findOne({ email: email }).then((savedUser) => {
            if (savedUser) {
                const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
                const { _id, name, email, username } = savedUser
                res.json({ token, user: { _id, name, email, username } })
            } else {
                const password = email + clientId
                const user = new USER({ name, email, username, password: password, Photo })
                user.save()
                    .then(user => {
                        let userId = user._id.toString();
                        const token = jwt.sign({ _id: savedUser }, Jwt_secret)
                        const { _id, name, email, username } = user;
                        res.json({ token, user: { _id, name, email, username } })
                    })
                    .catch(err => { console.log(err) })
            }
        })
    }
})
module.exports = router;

