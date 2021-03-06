'use strict';

const base64 = require('base-64');
const Users = require('../models/users-model.js');

module.exports = (req, res, next) => { 
  if (!req.headers.authorization) { 
    console.log('Eror');
    next('error'); }
  else {
    console.log('header', req.headers.authorization);
    let basic = req.headers.authorization.split(' ').pop();
    let [user, pass] = base64.decode(basic).split(':');
    let auth = { user, pass };
    return Users.basicAuth(auth)
      .then( user =>{
        console.log('user',user);
        req.user = user;
        console.log('reqUser', req.user);
        req.token = user.tokenGenerator(user);
        console.log('token', req.token);
        next();
      }).catch((err) => next('invalid user name or password'));
  }
};