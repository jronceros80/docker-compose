'use strict'

//Modulos
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

//Modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!song){
                res.status(404).send({ message: 'La cancion no existe'});
            }else{
                res.status(200).send({song});
            }
        }
    });
}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStore)=>{
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!songStore){
                res.status(404).send({ message: 'La cancion no ha sido guardado'});
            }else{
                res.status(200).send({ song: songStore});
            }
        }
    })
}

function getSongs(req, res){
    var albumId = req.params.album;

    if(!albumId){
        var find = Song.find({}).sort('number')
    }else{
        var find = Song.find({album: albumId}).sort('number')
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function(err, songs){
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!songs){
                res.status(404).send({ message: 'No hay canciones'});
            }else{
                res.status(200).send({ songs});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, {new:true}, (err, songUpdate) =>{
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!songUpdate){
                res.status(404).send({ message: 'La cancion no ha podido actualizarse'});
            }else{
                res.status(200).send({ song: songUpdate});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songDelete) =>{
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!songDelete){
                res.status(404).send({ message: 'La cancion no ha podido borrarse'});
            }else{
                res.status(200).send({ song: songDelete});
            }
        }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name ='No subido...';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.')
        var file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg' ){

            Song.findByIdAndUpdate(songId, {file: file_name}, {new:true}, (err, songUpdate) => {
                if(err){
                    res.status(500).send({ message: 'Error en el servidor'});
                }else{
                    if(!songUpdate){
                        res.status(404).send({ message: 'No se ha podido actualizar la cancion'});
                    }else{
                        res.status(200).send({ song: songUpdate, file: file_name});
                    }
                }
            });
        }else{
            fs.unlink('file_path', (err) => {
                if(err){
                    res.status(200).send({ message: 'extension no valida y fichero no borrado'});
                }else{
                    res.status(200).send({ message: 'extension no valida'});
                }
            });
        }
    }else{
        res.status(200).send({ message: 'no se han subido los archivos'});
    }
}


function getFile(req, res){
    var songFile = req.params.file;
    var path_file = './uploads/songs/'+ songFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({ message: 'El audio no existe'});
        }
    });
}

module.exports={
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile
}