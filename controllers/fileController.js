const File=require("../model/files");
const {v4:uuid4}=require('uuid')

const multer=require("multer");
const path=require("path")

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,uniqueName);
    }
})

let upload=multer({
    storage,
    limits:{fileSize:1000000*100}

}).single('myFile');

exports.addFile=async function(req,resp){

    
    //store file
    
    try {
        upload(req,resp,async(err)=>{
          
            if(err){
                return resp.status(500).json({message:err.message});
            }
            
    
            //Storing in database 
            const file=await File.create({
                filename:req.file.filename,
                uuid:uuid4(),
                path:req.file.path,
                size:req.file.size,
            })
    
            resp.status(201).json({success:true,message:`${process.env.APP_BASE_URL}/api/v1/files/${file.uuid}`});
    
        })
    } catch (error) {
        resp.status(500).json({success:false,message:"something Went Wrong"});

    }

}

exports.getFile=async function (req,resp){

    try {

        let file=await File.findOne({uuid:req.params.uuid});
        if(!file){
            return resp.render("download",{error:"Link has been expired or invalid link"})
        }

        return resp.render("download",{
            uuid:file.uuid,
            fileName:file.filename,
            fileSize:file.size,
            download:`${process.env.APP_BASE_URL}/api/v1/files/download/${file.uuid}`
        })

    } catch (error) {
        resp.status(500).json({success:false,message:"something Went Wrong"});

    }

}

exports.download=async function (req,resp){

    try {
        
        let file=await File.findOne({uuid:req.params.uuid});
        if(!file){
            return resp.render("download",{error:"Link has been expired or invalid link"})
        } 

        const filePath=`${__dirname}/../${file.path}`;
        resp.download(filePath);

    } catch (error) {
        resp.status(500).json({success:false,message:"something Went Wrong"});
    }
}

exports.emailSend=async function (req,resp){
   
    try {
        let {uuid,emailTo,emailFrom}=req.body;

    if(!uuid || !emailTo || !emailFrom){
        return resp.status(422).json({success:false,message:"All fields are required"})
    }

    let file=await File.findOne({uuid})
    
    if(!file){
        return resp.status(500).json({success:false,messge:"Link has been expired or invalid link"})
    }
    if(file.sender){
        return resp.status(422).json({success:false,message:"email already sent"})

    }

    file.sender=emailFrom;
    file.receiver=emailTo;

    let response=await file.save();

    //send email

    const sendMail=require('../services/emailService');
    await sendMail({from:emailFrom,to:emailTo,subject:"inShare File Sharing",text:`${emailFrom} shared a file with you`,html:require('../services/emailTemplate')({
        emailFrom,
        downloadLink:`${process.env.APP_BASE_URL}/api/v1/files/${file.uuid}`,
        size:parseInt(file.size/100)+"KB",
        expires:"24 hours"
    })})

    resp.status(201).json({success:true,message:'Email Sent'})
    } catch (error) {
        resp.status(500).json({success:false,message:"something Went Wrong"});
    }

}