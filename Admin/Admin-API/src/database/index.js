const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/admin-db', { useNewUrlParser: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

module.exports = mongoose;
