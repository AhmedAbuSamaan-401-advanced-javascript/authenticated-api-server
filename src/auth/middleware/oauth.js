'use strict';

const superagent = require('superagent');
const Users = require('../models/users-model');

const tokenServerUrl = process.env.TOKEN_SERVER ||'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    let remoteToken = await exchangeCodeForToken(code);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    next();
  } catch (e) { next(`Error: ${e.message}`); }
};

async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;

  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = 
  await superagent.get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'oAuthPassword',
  };
  let savedUser = new Users(userRecord);
  let user = await savedUser.save();
  let token = savedUser.tokenGenerator(user);

  return [user, token];
}