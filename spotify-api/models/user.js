'use strict'

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

//Esto es paa utilizar el fichero desde cualquier parte de la aplicacion
module.exports = mongoose.model('User', UserSchema);