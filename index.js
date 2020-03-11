require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const Route = require('./Router/Product_router')
app.use(express.static('uploads'))
let {JWTauthen} = require('./middleware/JWTauthen');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('express-session')({ 
	secret: 'keyboard cat', 
	resave: true, 
	saveUninitialized: true 
}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(JWTauthen)
try {
	mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (erro) => {
		if (erro) {
			console.log(erro);
		} else {
			console.log("Connected to DB");
		}
	});
} catch (error) {
	handleError(error);
}
const port = process.env.PORT;
app.use('/',Route);
app.listen(process.env.PORT || port, () => { console.log(`Example app listening on port ${port}`) })