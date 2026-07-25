const {addUser , getUsers } = require('../controllers/userController');
const {register , login } = require('../controllers/authController.js');
const express = require('express');
const Route =express();
Route.get(`/api/users` , getUsers);
Route.post(`/api/users` , addUser);

Route.post('/api/auth/user',register);
Route.post('/api/auth/users',login);
module.exports= {Route};