const router=require('express').Router();
const {addFile, getFile, download, emailSend}=require("../controllers/fileController")


router.post('/',addFile)
router.get("/files/:uuid",getFile)
router.get("/files/download/:uuid",download)
router.post("/files/email/send",emailSend)



module.exports=router;