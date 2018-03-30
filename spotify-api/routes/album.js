'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router(); //permite hacer get, post,put..etc
var md_auth = require('../middlewares/aunthenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});  //Ruta de ficheros a subir

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artistId?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/album/:albumId', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:albumId', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;