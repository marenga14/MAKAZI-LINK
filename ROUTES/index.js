const express =require('express');
const shop =express.Router();
const auth =require('../models/middleware/is-auth')
const adminData =require('./admin');
const input =require('../controllers/admin')
const path=require('path');
const { append } = require('express/lib/response');

shop.get('/',input.landing); 
 

module.exports=shop;

