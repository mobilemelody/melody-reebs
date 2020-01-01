require('dotenv').config();

const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const {google} = require('googleapis');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/about', function (req, res) {
	let data = {};
	data.page = "about";
	res.render('about', data);
});

app.get('/portfolio', function (req, res) {
	let data = {};
	data.page = "portfolio";
	res.render('portfolio', data);
});

app.get('/contact', function (req, res) {
	let data = {};
	data.page = "contact";
	res.render('contact', data);
});

app.post('/contact', function (req, res) {
	let data = {};
	data.page = "contact";
	data.submitted = true;
	res.render('contact', data);
});

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});