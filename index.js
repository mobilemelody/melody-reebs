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
	data.num1 = Math.floor(Math.random() * 10);
	data.num2 = Math.floor(Math.random() * 10);
	data.ans = data.num1 + data.num2;
	res.render('contact', data);
});

app.post('/contact', function (req, res) {
	let data = {};
	data.page = "contact";

	const scopes = 'https://www.googleapis.com/auth/spreadsheets';
	const sheets = google.sheets('v4');
	
	// Google authorization
	let jwt = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL, 
    null, 
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
    scopes
  );

	// Add form data
  let row = [];
  for (let key in req.body) {
  	row.push(req.body[key]);
  }
  row.pop();
  
  // Append values to spreadsheet
  sheets.spreadsheets.values.append({
    spreadsheetId: '1M3jHgPqZZRhD2tkyE_DpSzKSSEUTMfulHYqOMchGMwI',
    range: 'A:C',
    auth: jwt,
    valueInputOption: 'USER_ENTERED',
    resource: {values: [row]}
  }, function(err, result) {
    if (err) {
      console.log(err);
      data.error = true;
      res.render('contact', data);
    }
    else {
      data.submitted = true;
			res.render('contact', data);
    }
  });
	
});

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});