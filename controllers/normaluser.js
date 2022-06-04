
const product =[]

const bcrypt=require('bcryptjs');
const res = require('express/lib/response');
const normalUser=require('../models/normalUser')
const housedetail=require('../models/landlord');
const orders= require('../models/order')
const { ObjectId } = require('mongodb');
const { redirect } = require('express/lib/response');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const path =require('path');
const { link } = require('fs');
const { OutgoingMessage } = require('http');
const {check,validationResult} = require ('express-validator/check');
const { title } = require('process');
const CONT_PER_PAGE =6;
const stripe = require('stripe')('sk_test_51KohdAF6FyrZ5dlzVvhEi3elJSSjGapWx8I8pZcPCTrUAqG8FQ2gzKIG6PAdtpBVVf09HzeDJFQYWilPTFW5Fx3h00w56gWbgQ');

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
       
       api_key:'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'
    }
 }))
  

 






















// saving users in the databse
exports.postRegistration= (req, res, next) => { 

    const errors = validationResult(req)
   
    const fname = req.body.fname;
    const email=req.body.email;
    const lname=req.body.lname;
    const pass=req.body.pass;
    const conpass=req.body.passconfirm;
    
console.log(errors.array())

    if(!errors.isEmpty()  ){

        return res.status(422).render(
            'Registraation_page',
        {
            pageTitle:'register',
           csrfToken:req.csrfToken(),
           fname:fname,
           email:email,
           lname:lname,
           pass:pass,
           passconfirm:conpass,
           validationError: errors.array(),


           

       
    })
        
    }
    
    let User;
    

    bcrypt.hash(pass,10).then(hashedPassword=>{
        const normaluser=new normalUser({
            email:email,
            fname:fname,
            lname:lname,
            pass:hashedPassword,
        list:{house:[]}
            
           
    })
    return normaluser.save();
    req.user= normaluser;
 
}).then(result=>{
    res.redirect('/admin/login');
    transporter.sendMail({
        to:email,
        from:"marengajulius@gmail.com",
        subject:"SIGN UP COMPLETE",
        html: '<h1>You just sign up completelety to okoa mobile! you can now login and request for Ambulance at any timeThanks</h1>'
    })
    console.log("created")
    
}).catch(err=>{
    console.log(err);
})
}


//login middleware for the user
//rendering login page;



    //rendering the registration page
exports.addregistration= (req, res, next) => {
    
    res.render('Registraation_page',{pageTitle:'register', csrfToken:req.csrfToken(),fname:'',
    email:'',
    lname:'',
    pass:'',
    passconfirm:'', 
    price:'',
    validationError: []
}
    )}


    //output and the users from the database

    exports.outputRegistration= (req, res, next) => {
        normalUser.find()
        .then(users=>{
        
            res.render('normaluser',{pageTitle:'normal users',prods:users});

        }).catch(err=>{
            console.log(err);
        }) 
        }
        
    


        //Rendering and displaying add hous  page
        
      exports.getipunts=(req, res, next) => {
    
            res.render('add-house',{prods:product,  
                pageTitle:'Makazi Link',
                csrfToken:req.csrfToken(),
                 path: '/home'
                });
        };





//creating the house details in the database
    exports.postHouse= (req, res, next) => { 
       

        const title = req.body.title;
        const image=req.file;
        const description =req.body.description;
        const price =req.body.price;

    const link = image.path;

const housedetails = new housedetail({
    title:title,
    link:link,
    description:description,
    price:price,
    userId:req.user._id,
    
})

 housedetails.save().then(result=>{
    res.redirect("/addHouse");
    console.log('house created ');
 })
 .catch(err=>{
     console.log(err);
 })
}









//output the house details to the normal users page
 exports.outputHouse = (req, res, next) => {
     const page =+req.query.page || 1;

     housedetail.find()
     .countDocuments()
     .then( numberHouse=>{
         totalItems =numberHouse;
        return housedetail.find()
        .skip((page-1) *CONT_PER_PAGE)
        .limit(CONT_PER_PAGE)
     })
    .then(houses=>{ 
        if(!houses){

            
        res.render('no-house',{
            pageTitle:'Makazi_no',
           
            


        })
           
          
        } else{

             

        res.render('display_house',{
            pageTitle:'landlord',
            house:houses, 
            csrfToken:req.csrfToken(),
            path:'/home',
            currentPage:page,
            totalItems:totalItems,
            hasNextpage:page*CONT_PER_PAGE<totalItems,
            hasPreviouspage: page>1,
            nextPage:page + 1,
            previousPage:page-1,
            lastPage: Math.ceil(totalItems/CONT_PER_PAGE)
        })
        
        }
    }).catch(err=>{
        console.log(err);
    })
 }

 //see houses  to the lis and count them for the payments 

 exports.PostList = (req,res,next)=>{
    const houseId = req.body.houseId
  
housedetail.findById(houseId).then(house=>{
    req.user.addToList(house )
}).catch(err=>{
    console.log(err)
})
    



     }

     exports.outputlist=(req,res,next)=>{
 req.user
 .populate('list.house.houseId')
 .then(user=>{
     
     const lists = user.list.house
    res.render('list',{
        pageTitle:'landlord',
        list:lists, 
        csrfToken:req.csrfToken(),
        path:'/viewlist',
         
    })


 }).catch(err=>{
     console.log(err)
 })
  
     }


     //delete the list of houses from the houses
     exports.postDeletelist=(req,res,next)=>{
         const prodId =req.body.houseId;
         
         req.user
         .removeFromList(prodId)
         .then(result=>{
             res.redirect('/viewlist')
         }).catch(err=>{
             console.log(err)
         })
     }


     //order items 
exports.postOrders = (req,res,next)=>{
    let totalSum =0;
    const token =req.body.stripeToken;
    req.user
    .populate('list.house.houseId')
    .then(user=>{
        
        const lists = user.list.house.map(i=>{
         return   {quantity:i.quantity,
            house:{...i.houseId._doc}}
        }) 
        
      
        
        user.list.house.forEach(p=>{
            totalSum += p.quantity * p.houseId.price
        })
        totalSum = parseInt(totalSum/2350)
console.log(totalSum);

        const order =new orders({
        User:{
            UserId:req.user
        },
         
        list:lists
        

        
       })

       
        
return order.save()

    }).then(result=>{

        const charges = stripe.charges.create({
            amount: totalSum *100,
            description:"You receive this Email, as your subscription to MAKAZI LINK SERVICES, Via Stripes. Welcome back!",
            source: token,
            currency:'usd'

        })

    req.user.clearList();
    res.redirect('/orders')
    }).catch(err=>{
        console.log(err)
    })

}

//ouput orders 
exports.outputOrders =(req,res,next)=>{
    orders.find({'User.UserId':req.user._id}).then(orders=>{
    
         res.render('orders',{
             pageTitle:'orders',
             order:orders,
             path:'/orders',
             csrfToken:req.csrfToken(),
            //  total:total
         })
    }).catch(err=>{ 
        console.log(err)
    })
}




//get checkot page


exports.getCheckout=(req,res,next) =>{
    req.user
 .populate('list.house.houseId')
 .then(user=>{
     

let total =0;

     const lists = user.list.house
     lists.forEach(p=>{
         total += p.quantity * p.price
         
         
     })

     total= parseInt(total/2350);
     console.log(total)
    res.render('checkout',{
        pageTitle:'landlord',
        list:lists, 
        csrfToken:req.csrfToken(),
        path:'/viewlist',
        totalsum:total
         
    })
   
       
    }).catch(err=>{
        console.log(err)
    })
}

 exports.landing = (req, res, next) => {
 
    res.render('index',{pageTitle:'landing',
    csrfToken:req.csrfToken(),
    path:'/'
      })
}

     
      