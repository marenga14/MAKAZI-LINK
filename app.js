const express = require('express');
const mongoose =require('mongoose');
const parsedbody =require('body-parser');
const session=require('express-session');
const redirect = require("express-redirect")
 const MongoDBStore=require('connect-mongodb-session')(session);
const path =require('path');
const app = express();
const csrf=require('csurf');
const {check,validationResult} = require ('express-validator/check')
redirect(app);
 

// This is your test secret API key.


 
 

 

 























const multer =require('multer')


const fileStorage = multer.diskStorage({
   destination: (req,file,cb)=>{
      cb (null,'images');
   },
   filename:(req,file,cb)=>{
      cb (null, Date.now() + "_" + file.originalname)
   }

}
)
 const fileFilter = (req,file,cb)=>{
     if(file.mimetype==='image/png' ||file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' ){
        cb(null,true)

     } else{
     cb(null, false)
     }
 }


const MONGODB_URI="mongodb://localhost:27017/Newmakazi";


//  creating a session database store
const store =new MongoDBStore({
   uri:MONGODB_URI,
   collection:'sessions'
});


app.set('view engine', 'ejs');
app.set('views','Views');
const csrfProtection= csrf();


app.use(express.static(path.join(__dirname,'public/public')));
app.use( '/images', express.static(path.join(__dirname,'images')));
app.use(session(
   {
      secret:'I am in love with Jesus in the holy sacrament',resave: false,
      saveUninitialized:false,
      store:store
   }
   ));

   app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))


   app.use((req,res,next)=>{
      if(!req.session.user){
         return next()
      }
      normalUser.findById(req.session.user._id).then(user=>{
   req.user=user;
   next()
   
   
      }).catch(err=>{
         console.log(err)
      })
   })
    
    

 


app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:'I am in love with Jesus in the holy sacrament',resave: false,saveUninitialized:false,store:store}))
app.use (parsedbody.urlencoded({extended:false}));
app.use(csrfProtection);
// const normalUser= require('../models/normalUser')
var db = require("./config/database.js");


   const adminRoutes=require('./ROUTES/admin');
   const houseroute= require('./ROUTES/normalRouter');
const normalUser = require('./models/normalUser.js');


 
   
//   app.use((req,res,next)=>{
//      res.locals.isAuthenticated=req.session.isLoggedIn
//      res.locals.csrf=req.csrfToken();
//   })
app.use('/admin',adminRoutes);
app.use(houseroute);
// app.use((req,res,next) =>{  
//    normaluser.findById('').then(normaluser=>{
//       req.normaluser=normaluser;
//       next();
//    })
// }
// )


app.use((req,res,next)=>{
res.status(400).render('error',{pageTitle:'page not found'});
});

// mongoose.connect('mongodb+srv://Marenga:kipipa14@makazi.olojg.mongodb.net/MAKAZIretryWrites=true&w=majority')
 //.then(result=>{
   
// nornaluser.findOne().then(user=>{

//    if(!user){  const normaluser =new normalUser({
//       fname:'marenga',
//       lname:'Julius',
//       cont:'marenga@me.com',
//       pass:"pixel",
      
//          })
//          normaluser.save();

//    }
// });


db();
   app.listen(5000,()=>{
      console.log('server is listening')
   });
//  })
 
//  //.catch(err=>{
//     console.log(err);
//  })
