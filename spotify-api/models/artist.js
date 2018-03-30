'use strict'

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

//Esto es paa utilizar el fichero desde cualquier parte de la aplicacion
module.exports = mongoose.model('Artist', ArtistSchema);