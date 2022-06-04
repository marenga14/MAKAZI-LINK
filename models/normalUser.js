 const { ObjectId } = require('mongodb');
const mongoose =require('mongoose');

 const Schema=mongoose.Schema;

 const normalSchema= new Schema({
     fname: {
         type:String,
         required:true,
     },
lname:{
    type:String,
    required:true
},
 email:{
     type:String,
     required:true,
    },

    pass:{
        type:String,
        reqired:true,
    },
    passconfirm:{
        type:String,
        reqired:true,
    },
    resetToken:String,
    expireDate:Date,


   
    list:{
        house:[ {
            price:{
                type:Number,
                ref:'housedetail',
                required:true
            },
          
            houseId:{
                type:Schema.Types.ObjectId,  
                ref:'housedetail',
                required:true
            },
         
        quantity:{
           type:Number,
           required:true
          
        }
    }
     ]
     
     }
     
 });
///

//

 normalSchema.methods.removeFromList = function(houseId){

const updatedlist = this.list.house.filter(houses=>{
   return  houses.houseId.toString() !== houseId.toString()
})
this.list.house =updatedlist;
return this.save()
 }
////
//
//

 normalSchema.methods.addToList = function (house){
   
   const houseId =house._id;
   const price =house.price;
  
const listIndex = this.list.house.findIndex(cp=>{

      return cp.houseId.toString() === houseId.toString()
}) 

let newQuantity=1;
const updatedCartItems = [...this.list.house]
 
if (listIndex>=0){
    newQuantity = this.list.house[listIndex].quantity +1;
    updatedCartItems[listIndex].quantity = newQuantity;

}  else{
    updatedCartItems.push({
        price:price,
        quantity:newQuantity,
        houseId: house._id

    })
}
  const updatecart = {
      house:updatedCartItems
  }

  this.list=updatecart;
  
  this.save();
  

   }


   //clear the list when the ordersa are done placed
   normalSchema.methods.clearList= function(){
  this.list= {house:[]}
   return this.save()

}

 
 
 module.exports=mongoose.model('normalUser',normalSchema);
 