const product =[]

const bcrypt=require('bcryptjs');
const res = require('express/lib/response');
const normalUser=require('../models/normalUser')
const housedetail=require('../models/landlord');
const { ObjectId } = require('mongodb');
const { redirect } = require('express/lib/response');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const path =require('path');
const { link } = require('fs');
const { OutgoingMessage } = require('http');


const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
       
       api_key:'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'
    }
 }))


 exports.displayLogin = (req,res,next)=>{

    res.render('login',{
        pageTitle:'login', 
        csrfToken:req.csrfToken(),
    path: '/admin/reset'})
}

exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const pass=req.body.pass;


    normalUser.findOne({email:email}).then(user=>{
        if(!user){
            console.log("no such user");
            return res.redirect('/register');
        }

         
        bcrypt
        .compare(pass,user.pass)
        .then(result=>{
            if(result){
                req.session.isLoggedIn=true;
                req.session.user=user;
               return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/home');
                });
            }
console.log('wroongggggggg passsss')
            res.redirect("/admin/login");
        }).catch(err=>{
            console.log(err);
            res.redirect("/admin/login")
        })
    }).catch(err=>{
        console.log(err);
    }
    )

}



//reset password problems get and post controllers
exports.getReset=(req,res,next)=>{
    res.render('reset',
    {pageTitle:"Makazi_link",
     csrfToken:req.csrfToken(),
     path: '/admin/reset'
    
    
    })
}

exports.postReset=(req,res,next)=>{
           
crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err);
        res.redirect('admin/login')
    }

    const token =buffer.toString('hex');
    console.log(token);

    normalUser.findOne({email:req.body.email}).then(user=>{
        if(!user){
          return  console.log("user doesnt exists")
        }

        user.resetToken=token;
        user.expireDate=Date.now() + 3600000;
        return user.save()
    }).then(result=>{
        res.redirect('/admin/login');

        transporter.sendMail({
            to:req.body.email,
            from:"marengajulius@gmail.com",
            subject:"Reset pass word requiest",
            html: `<h1>You just sign up completelety to okoa mobile! <a href="http:localhost:3000/admin/reset/${token}"\> you can now login and request for Ambulance at any time Thanks</h1>`

        })

    }).catch(err=>{
        console.log(err);
    })
})
}


  exports.renderTokenPage= (req,res,next)=>{
      const token=req.params.token;
      console.log(req.params.token)
      normalUser.findOne({token:token,expireDate:{$gt:Date.now()}}).then( user=>{
   
res.render('resetForm',{
    pageTitle:"reset",
    userId: user._id,
    csrfToken:req.csrfToken(),
    passToken:token,
    
})

      }
      ).catch(err=>{
          console.log(err);
      })

  }


  //finally updating the password
  exports.finalreseting=(req,res,next)=>{
      const newPass= req.body.pass;
      const passToken=req.body.token;
      const userId=req.body.userId;
      console.log(userId)
let User;
      normalUser.findOne({
    //resetToken:passToken,
        _id:userId,

          
         expireDate:{$gt:Date.now()}

              
        }).then( user=>{ if(!user){
            return console.log("hollaaaaa")
        }
            User=user;
           return bcrypt.hash(newPass,12)
        }

        ).then(
            hashedpass=>{
                 
                User.pass = hashedpass;
                User.resetToken=undefined;
                User.expireDate=undefined;

                return User.save()

            
            }
        ).then(result=>{
            res.redirect('/admin/login')
        }).catch(err=>{
            console.log(err)
        })
  }




//logout controller
exports.postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/admin/login')
    })
}







