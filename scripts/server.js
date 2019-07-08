const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const path = require('path');
const cors = require('cors');
const webpackConfig = require('./webpack.config.dev');

const compiler = webpack(webpackConfig);
const app = express();

app.use(cors());
app.use('/', express.static(path.resolve(__dirname, '..')));
app.use(middleware(compiler, { publicPath: '/dist' }));

module.exports = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', function (req, res) {
  console.log('login');
  res.sendFile(path.join(__dirname + '/login.html'));
})

app.get('/login', function (req, res) {
  console.log('login');
  res.sendFile(path.join(__dirname + '/login.html'));
})

app.get('/signup', function (req, res) {
  console.log('signup');
  res.sendFile(path.join(__dirname + '/signup.html'));
})

app.get('/patient_signup', function (req, res) {
  console.log('patient signup');
  res.sendFile(path.join(__dirname + '/patient_signup.html'));
})

app.get('/provider_signup', function (req, res) {
  console.log('provider signup');
  res.sendFile(path.join(__dirname + '/provider_signup.html'));
})