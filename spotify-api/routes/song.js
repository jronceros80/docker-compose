'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router(); //permite hacer get, post,put..etc
var md_auth = require('../middlewares/aunthenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});  //Ruta de ficheros a subir

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-file-song/:file', SongController.getFile);

module.exports = api;