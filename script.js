const File =require("./model/files");
const fs=require("fs");
const connectDB=require("./config/database");

connectDB();

async function deleteOutDatedFiles(){
    let pastDate=new Date(Date.now() - 864000000);
    let files=await File.find({createdAt:{$lt:pastDate}});

    if(files.length){
        for(const file of files){
            try {
                fs.unlinkSync(file.path);
                await file.remove()
                console.log(`successfully deleted ${file.filename}`);
            } catch (error) {
                console.log("Cannot perform the operation because "+error.message);
            }
        }

    }
}

deleteOutDatedFiles().then(process.exit)