'use strict'

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,    
    album: {type: Schema.ObjectId, ref:'Album'}
});

//Esto es para utilizar el fichero desde cualquier parte de la aplicacion
module.exports = mongoose.model('Song', SongSchema);

