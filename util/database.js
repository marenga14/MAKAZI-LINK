const mongodb =require('mongodb');
const MongoClient=mongodb.MongoClient;




const mongoConnect=(callback )=>{
    MongoClient.connect('mongodb+srv://Marenga:kipipa14@makazi.olojg.mongodb.net/MAKAZI?retryWrites=true&w=majority').then(client=>{

        console.log('connected!');
        callback(client)
    }).catch(err=>{
        console.log(err);
    });

};


module.exports=mongoConnect;


