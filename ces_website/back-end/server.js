const express = require('express');

const fileUpload = require('express-fileupload');

var admin = require("firebase-admin");

var config = {
    apiKey: "AIzaSyADrVRU9CSIktkXnvQXcXFeOPicmYtC91M",
    authDomain: "ceswebsite-cf841.firebaseapp.com",
    databaseURL: "https://ceswebsite-cf841.firebaseio.com",
    projectId: "ceswebsite-cf841",
    storageBucket: "ceswebsite-cf841.appspot.com",
    messagingSenderId: "612020639792"
};

admin.initializeApp(config);

//This object is for parsing body of requests.
const bodyParser = require('body-parser');


//This gets an instance of express class
//which creates a server on construction.
const app = express();

//Just saying for encoding url, don't extend meaning don't replace anything as may actually need
app.use(bodyParser.urlencoded({extended:false}));

//Telling app to use json parser for parsing bodies
app.use(bodyParser.json());

app.use(fileUpload());

const port = process.env.port || 5000;

app.listen(port,()=>{console.log("listening on port " + port)});