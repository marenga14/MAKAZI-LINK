
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
const CONT_PER_PAGE =6;


const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
       
       api_key:'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'
    }
 }))
 


 //add house page in the admin section 
 exports.updateHouse = (req, res, next) => {
    const page =+req.params.page || 1;
    housedetail.find({userId:req.user._id} )
    .countDocuments().then(
        numberHouse=>{
            const totalItems=numberHouse
            return housedetail.find()
            .skip((page-1)*CONT_PER_PAGE)
            .limit(CONT_PER_PAGE)
        }
    )
    .then(houses=>{
        if(!houses){
            res.redirect('/admin/addHouse')
        }
        res.render('admin_edit_house',{
            pageTitle:'landlord',
            house:houses,
            path:'/home',
            csrfToken:req.csrfToken(),
            currentPage:page,
            totalItems:totalItems,
            hasNextpage:page*CONT_PER_PAGE<totalItems,
            hasPreviouspage: page>1,
            nextPage:page + 1,
            previousPage:page-1,
            lastPage: Math.ceil(totalItems/CONT_PER_PAGE)
        });
        
    }).catch(err=>{
        console.log(err);
    })
   
 }




 exports.getEditproduct= (req,res)=>{
     houseId=req.query.id;
      
     housedetail.findById(houseId).
     then(houses=>{
        if(req.user._id.toString() !==houses.userId.toString()){
            return res.redirect('/admin/edit')
         }
         
         res.render('update_house', {
             
            pageTitle:'update',
            house:houses,
            csrfToken:req.csrfToken(),
            path:'/home'? 'active': '/addHouse'
        });

        
     })
 }
// //update the house_the  
    
    exports.editHouse = (req, res, next) => { 
 
        const houseId = req.query.id
        const updateTitle = req.body.title;
        const image = req.file;
        const updateDescription = req.body.description;
     
    const updateLink =image.path;

        housedetail.findById(houseId ).then( house=>{ 
            house.title= updateTitle;
            if(image){
            house.link= updateLink;
            }
            house.description= updateDescription;
            return house.save();
        })
        .then(result=>{
    res.redirect("/home")
        
    console.log('house updated ')})
 .catch(err=>{
     console.log(err);
 })
}



//delete the house from the datacase
 exports.deleteHouse=(req,res,next)=>{
     houseId=req.query.id
     housedetail.deleteOne({_id:houseId,userId:req.user._id}).then(
         ()=>{//console.log(houses.title);
             console.log("house deleted")
         }
     ).catch( err=>{
         console.log("err")
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

 exports.landing=(req,res,next)=>{
    res.render('index', {
             
        pageTitle:'landing',
        house:houses,
        csrfToken:req.csrfToken(),
        path:'/'
    });

 }