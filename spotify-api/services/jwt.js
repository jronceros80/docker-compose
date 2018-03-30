'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_curso';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),               //fecha de creacion del token
        exp:moment().add(30, 'days').unix   //fecha de expiracion del token
    };

    return jwt.encode(payload, secret);
};