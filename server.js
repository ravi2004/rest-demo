require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");

const mdb = require('mongodb').MongoClient
const app = express();
app.use(express.json());


const User = mongoose.model('User', {
    userName: String,
    userEmail: String,
    userPassword: String
});

console.log(process.env);
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology: true, socketTimeoutMS: 1000, useNewUrlParser: true });
const PORT = process.env.SERVER_PORT || 3000;

app.get("/api/getRestStatus", (req, res) => {
    res.json({ 'status': 200, 'statusCode': 'OK', 'result': 'Rest Connection is Working Fine' });
});

app.post("/api/registerUser", async (req, res) => {
    var user = new User(req.body)
    await User.find({ 'userEmail': req.body.userEmail })
        .then(async (result) => {
            console.log(result);
            if (result.length > 0) {
                console.log('record found');
                res.json({ 'status': 200, 'statusCode': 'OK', 'result': 'Duplicate User' });
            } else {
                console.log('record not found');
                await user.save()
                    .then(saveresult => {
                        //console.log(saveresult);
                        res.json({ 'status': 200, 'statusCode': 'OK', 'result': 'Registered Successfully' });
                    })
                    .catch(err => {
                        res.json({ 'status': 200, 'statusCode': 'error', 'result': err });
                    });
            }
        })
        .catch(err => {
            res.json({ 'status': 200, 'statusCode': 'error', 'result': err });
        });
});

app.get('/api/userList', (req, res) => {
    User.find({})
        .then(async (data) => {
            res.json({ 'status': 200, 'statusCode': 'OK', 'result': data });
        })
        .catch((err) => {
            console.log("Error occured, " + err)
            res.json({ 'status': 200, 'statusCode': 'error', 'result': err });
        });
});

app.get('/home', (req, res) => {
    console.log('received request');
    res.send({ 'msg': 'Rest is working Fine' });
});

app.get('*', (req, res) => {
    console.log('received request');
    res.send({ 'msg': 'all good' });
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});