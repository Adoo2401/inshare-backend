const mongoose=require("mongoose");

 function connectDatabase(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>console.log('connection Successfull')).catch(err=>console.log(err))
 }

module.exports=connectDatabase