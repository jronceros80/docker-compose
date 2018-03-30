'use strict'

//Modulos
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

//Modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist)=>{
        if(err){
            res.status(500).send({ message: 'Error en la peticion'});
        }else{
            if(!artist){
                res.status(400).send({ message: 'El artista no se pudo recuperar'});
            }else{
                res.status(200).send({ artist});
            }
        }
    });
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;  
    }
    
    var itemPerPage = 5;

    Artist.find().sort('name').paginate(page, itemPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({ message: 'Error en la peticion'});
        }else{
            if(!artists){
                res.status(400).send({ message: 'No hay artistas'});
            }else{
                return res.status(200).send({ 
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req, res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    artist.save((err, artistStore) =>{
        if(err){
            res.status(500).send({ message: 'Error al guardar el artista'});
        }else{
            if(!artistStore){
                res.status(400).send({ message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({ artist: artistStore});
            }
        }
    });
}

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update,  {new:true}, (err, artistUpdate) =>{
        if(err){
            res.status(500).send({ message: 'Error al actualizar el artista'});
        }else{
            if(!artistUpdate){
                res.status(400).send({ message: 'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({ artist: artistUpdate});
            }
        }
    });
}

function deleteArtist(req, res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
        if(err){
            res.status(500).send({ message: 'Error al borrar el artista'});
        }else{
            if(!artistRemoved){
                res.status(400).send({ message: 'El artista no ha sido borrado'});
            }else{
                //Eliminamos los albunes aspciados al artista
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
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
                                        res.status(200).send({ artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });

                
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name ='No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.')
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' ||file_ext == 'jpeg' ||file_ext == 'gif' ){

            Artist.findByIdAndUpdate(artistId, {image: file_name}, {new:true}, (err, artistUpdate) => {
                if(err){
                    res.status(500).send({ message: 'Error al actualizar el usuario'});
                }else{
                    if(!artistUpdate){
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({ artist: artistUpdate, image: file_name});
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
    var path_file = './uploads/artists/'+ imageFile;
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
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};