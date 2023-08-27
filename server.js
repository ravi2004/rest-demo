require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const path=require('path')
const mdb = require('mongodb').MongoClient
const app = express();
app.use(express.json());
var api_router = express.Router();

const User = mongoose.model('User', {
    userName: String,
    userEmail: String,
    userPassword: String
});

app.use(express.static(path.join(__dirname, '../demo-app/build')));

//console.log(process.env);
mongoose.connect(process.env.DATABASE_URL /*AZURE_COSMOS_CONNECTIONSTRING*/, {useUnifiedTopology: true, socketTimeoutMS: 1000, useNewUrlParser: true });
const SERVER_PORT = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
    console.log('received request');
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    //res.sendFile(path.join(__dirname, '../demo-app/build', 'manifest.json'));
});


app.get('*', (req, res) => {
    console.log('received request');
    res.send({ 'msg': 'all good' });
});

app.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log("Server Listening on PORT:", SERVER_PORT);
});