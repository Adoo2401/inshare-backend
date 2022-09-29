const nodemailer=require("nodemailer");

async function sendMail({from,to,subject,text,html}){
    
   try {

    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{user:process.env.MAIL_USER,pass:process.env.MAIL_PASSWORD}
    });

    let info=await transporter.sendMail({from:`inShare <${from}>`,to,subject,text,html})

   } catch (error) {
        console.log(error);
   }

}

module.exports=sendMail