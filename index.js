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
  data.tag = req.query.tag;

  const scopes = 'https://www.googleapis.com/auth/spreadsheets';
  const sheets = google.sheets('v4');
  
  // Google authorization
  let jwt = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL, 
    null, 
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
    scopes
  );

  // Get values from spreadsheet
  sheets.spreadsheets.values.get({
    spreadsheetId: '1xUF-z_QRHxdp2qZaCdHR8nku3qZa8s66bNrGjQ4_0zg',
    range: 'A:G',
    majorDimension: 'ROWS',
    auth: jwt,
  }, function(err, result) {
    if (err) {
      console.log(err);
    }
    else {
      let values = result.data.values;
      let keys = values[0];
      data.portfolio = [];
      data.tags = [];
      for (let i = 1; i < values.length; i++) {
        let item = {};
        for (let j = 0; j < keys.length; j++) {
          if (keys[j] == 'tags' && values[i][j]) {
            item[keys[j]] = values[i][j].split(", ");
            data.tags = data.tags.concat(item[keys[j]]);
          } else if (keys[j] == 'images' && values[i][j]) {
            item[keys[j]] = values[i][j].split(", ");
          } else {
            item[keys[j]] = values[i][j];
          }
        }
        data.portfolio.push(item);
      }
      data.portfolio.reverse();
      data.tags = data.tags.sort().filter(function (val, index, array) {
        return array.indexOf(val) == index;
      });
      res.render('portfolio', data);
    }
  });
  
});

app.get('/hello', function (req, res) {
  let data = {};
  data.page = "contact";
  data.num1 = Math.floor(Math.random() * 10);
  data.num2 = Math.floor(Math.random() * 10);
  res.render('contact', data);
});

app.post('/hello', function (req, res) {
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

  // Add timestamp
  row.push(new Date());

  // Add IP address
  row.push(req.ip)
  
  // Append values to spreadsheet
  sheets.spreadsheets.values.append({
    spreadsheetId: '1M3jHgPqZZRhD2tkyE_DpSzKSSEUTMfulHYqOMchGMwI',
    range: 'A:E',
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

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});