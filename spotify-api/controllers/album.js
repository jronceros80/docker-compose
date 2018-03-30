'use strict'

//Modulos
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

//Modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
        if(err){
            res.status(500).send({ message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(400).send({ message: 'El album no se pudo recuperar'});
            }else{
                res.status(200).send({album});
            }
        }
    });      
}

function getAlbums(req, res){
    var artistId = req.params.artistId;

    if(!artistId){
        //Obtener todos los albunes de la BD
        var find = Album.find({}).sort('title');
    }else{
        //Obtener todos los albunes de un artista
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums)=>{
        if(err){
            res.status(500).send({ message: 'Error en la peticion'});
        }else{
            if(!albums){
                res.status(400).send({ message: 'Los albunes no se pueden recuperar'});
            }else{
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save((err, albumStore)=>{
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!albumStore){
                res.status(400).send({ message: 'El album no ha sido guardado'});
            }else{
                res.status(200).send({ album: albumStore});
            }
        }
    })
}

function updateAlbum(req, res){
    var albumId = req.params.albumId;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, {new:true}, (err, albumUpdate) =>{
        if(err){
            res.status(500).send({ message: 'Error en el servidor'});
        }else{
            if(!albumUpdate){
                res.status(400).send({ message: 'El album no ha sido actualizado'});
            }else{
                res.status(200).send({ album: albumUpdate});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.albumId;

    Album.findByIdAndRemove(albumId,(err, albumRemoved)=>{
        if(err){
            res.status(500).send({ message: 'Error al borrar el album'});
        }else{
            if(!albumRemoved){
                res.status(400).send({ message: 'El album no ha sido borrado'});
            }else{
                //Eliminamos las canciones asociadas al album del artista
                Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                    if(err){
                        res.status(500).send({ message: 'Error al borrar la cancion'});
                    }else{
                        if(!albumRemoved){
                            res.status(400).send({ message: 'La cancion no ha sido borrado'});
                        }else{
                            res.status(200).send({ album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name ='No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.')
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' ||file_ext == 'jpeg' ||file_ext == 'gif' ){

            Album.findByIdAndUpdate(albumId, {image: file_name}, {new:true}, (err, albumUpdate) => {
                if(err){
                    res.status(500).send({ message: 'Error al actualizar el usuario'});
                }else{
                    if(!albumUpdate){
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({ album: albumUpdate, image: file_name});
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


function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+ imageFile;
    console.log(imageFile);

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({ message: 'la imagen no existe'});
        }
    });
}
module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};