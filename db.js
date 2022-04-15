require('dotenv').config({path:"./config.env"})
const mongoose = require('mongoose');
const mongouri=process.env.MYDATABASE
//const mongouri="mongodb+srv://hadaganpat:ganpatmongodb22@cluster0.x9kii.mongodb.net/inotebook?retryWrites=true&w=majority"

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