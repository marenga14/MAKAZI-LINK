const express =require('express');
const shop =express.Router();
const auth =require('../models/middleware/is-auth')
const adminData =require('./admin');
const normal =require('../controllers/normaluser')
const path=require('path');
const { append } = require('express/lib/response');
const {check,body,validationResult} =require('express-validator/check')
const normalUser=require('../models/normalUser')


shop.get('/register',normal.addregistration );

shop.get('/nUsers',auth,normal.outputRegistration);    

shop.post('/disp',
            check('email')
            .isEmail()
            .normalizeEmail()
            .custom( value=> {
               return normalUser
               .findOne({email:value})
               .then(user=>{
  
                    if(user){ 
                      return Promise.reject('user exists')

                        // console.log('user exists')
                        // return res.redirect('/register');
                    }; 
                })
            }),
            body('pass')
            .isLength({min:5}),
            body('passconfirm').custom((value,{req})=>{
              if(value != req.body.pass){
              throw new Error ('paswords must match')
}
return true;
            }),
            
            normal.postRegistration);
shop.post('/disp1',auth,normal.postHouse);

shop.use('/home',auth,normal.outputHouse);

shop.get('/addHouse',auth,normal.getipunts);
shop.get('/',normal.landing); 
shop.post('/list',normal.PostList);
shop.get('/viewlist',normal.outputlist)
shop.post('/order-items',normal.postOrders)
shop.post('/deleteList',normal.postDeletelist)
shop.get('/orders',normal.outputOrders)
shop.get ('/checkout',normal.getCheckout)
module.exports=shop;

