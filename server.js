require("dotenv").config({path:"./.env"})
const connectDatabase =require("./config/database");
const express=require("express");
const cors=require("cors");
const app=express();
const path=require("path");
app.use(cors())
app.use(express.json());
app.use(express.static('public'))
let PORT=process.env.PORT || 5000;


connectDatabase();

//templage engine

app.set("views",path.join(__dirname,'/views'))
app.set("view engine",'ejs')

//routes
app.use("/api/v1",require('./routes/files'));

app.listen(PORT,()=>{
    console.log(`Listening to the port ${PORT}`);
})