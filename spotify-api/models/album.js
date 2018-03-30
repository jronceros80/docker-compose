'use strict'

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: Schema.ObjectId, ref:'Artist'}
});

//Esto es paa utilizar el fichero desde cualquier parte de la aplicacion
module.exports = mongoose.model('Album', AlbumSchema);