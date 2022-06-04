const mongoose =require('mongoose');

 const Schema=mongoose.Schema;
 const addHouse =new Schema({
    title:{
        type:String,
        reqired:true,
    },
    
    link:{
   type:String,
   required:true,
},

description:{
   type:String,
   required:true,
},

price:{
   type:Number,
   required:true
},

userId:{
   type: mongoose.Schema.Types.ObjectId, 
   required:true,
   ref: 'normalUser',
},


    
})







module.exports=mongoose.model('housedetail',addHouse);