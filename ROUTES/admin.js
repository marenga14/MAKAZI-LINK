
const express= require('express');
const auth =require('../models/middleware/is-auth');
const router =express.Router();
const path= require('path');
const register= require('../controllers/admin')
const authentication=require('../controllers/auth');
const normal=require('../controllers/normaluser');
const {check,body,validationResult} =require('express-validator/check')
 



router.get('/login',
authentication.displayLogin);
router.post('/displogin',
         check('email')
         .isEmail()
         .normalizeEmail(),
         body('pass').isLength({min:5}),
                    authentication.postLogin);

//router.use('/updatehouse',register.updatePage); 
router.use('/delete_house',auth,register.deleteHouse);
router.get('/edit',register.updateHouse);
router.get('/edit_house',register.getEditproduct)
router.post('/update',register.editHouse)
router.post('/logout',auth,authentication.postLogout);
router.post('/reset',authentication.postReset); //sed email when reset button pressed
router.get('/reset/:token',authentication.renderTokenPage)//from reset page to new
router.get('/reset',authentication.getReset) //from login to reset page
router.post('/setpass',authentication.finalreseting)


module.exports=router; 


 












