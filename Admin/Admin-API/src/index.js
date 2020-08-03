const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/')

require('./app/controllers/index')(app);

PORT = 2000;
app.listen(PORT);
