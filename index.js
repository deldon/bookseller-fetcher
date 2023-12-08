const express = require('express');
const router = require('./app/router');
const path = require('path');

const port = 3066;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static(path.join(__dirname, './public')));
app.use('/static', express.static('node_modules'));
//app.use(express.urlencoded({ extended: true }));
// OR
app.use(express.json());

app.use(router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}`);
});