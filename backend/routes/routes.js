const {addUser , getUsers } = require('../controllers/userController');
const {register , login } = require('../controllers/authController.js');
const express = require('express');
const { LSTMStockPredictor}=require('../lstm/predictor.js');

const Route =express();
Route.get(`/api/users` , getUsers);
Route.post(`/api/users` , addUser);

Route.post('/api/auth/user',register);
Route.post('/api/auth/users',login);

Route.get('/predict/:ticker',async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    try {

    } catch(err) {
        console.error(`Error occurred while predicting stockprices for ${req.params}: ${err}` );   }
});
module.exports= {Route};