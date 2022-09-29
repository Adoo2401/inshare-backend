const mongoose=require("mongoose");

let File=mongoose.model('',new mongoose.Schema({

    filename:{type:String,required:true},
    path:{type:String,required:true},
    size:{type:String,required:true},
    uuid:{type:String,required:true},
    sender:{type:String},
    receiver:{type:String}
    
},{timestamps:true}));

module.exports=File
