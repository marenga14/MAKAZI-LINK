const { ObjectId } = require('mongodb');
const mongoose =require('mongoose');

 const Schema=mongoose.Schema;
 const orderSchema = new  Schema({
list:[
    {
    house:{ type:Object,
    required:true},
quantity:{
    type:Number,
    required:true}
}
],
User:{
   
    UserId:{
        type:Schema.Types.ObjectId,
        reqired:true,
        ref:'normalUser'
    }
}
 })

 module.exports =mongoose.model('orders',orderSchema);