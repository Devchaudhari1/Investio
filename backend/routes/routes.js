const {addUser , getUsers } = require('../controllers/userController');
const {register , login } = require('../controllers/authController.js');

const express = require('express');

const { predict}=require('../controllers/predictorController.js');
const { getCommodityData } = require('../controllers/commodityController.js');
const { getEquityData } = require('../controllers/equityController.js');
const { getOptionsData } = require('../controllers/optionsController.js');
const { getNiftyData } = require('../controllers/niftyController.js');
const { getForexData } = require('../controllers/forexController.js');


const Route =express();
Route.get(`/api/users` , getUsers);
Route.post(`/api/users` , addUser);

Route.post('/api/auth/user',register);
Route.post('/api/auth/users',login);

Route.get('/predict/:ticker',predict);
Route.get(`/commodity`,getCommodityData);
Route.get(`/equity`, getEquityData);
Route.get(`/options`, getOptionsData);
Route.get(`/forex`, getForexData);
Route.get(`/nifty`, getNiftyData);

module.exports= {Route};