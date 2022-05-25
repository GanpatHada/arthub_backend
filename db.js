require('dotenv').config({path:"./config.env"})
const mongoose = require('mongoose');
const mongouri=process.env.MYDATABASE
//const mongouri="mongodb+srv://hadaganpat22112001:hadaganpat42@cluster0.eoffz.mongodb.net/Arthub?retryWrites=true&w=majority"

const connectToMongo = async()=>{
  try{  
  await mongoose.connect(mongouri);
  console.log("connection success");
}
catch(error)
{
    console.log("connection unsuccessful",error);
}
}

module.exports=connectToMongo;
