const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema=new Schema({
       
       name:{
           type:String,
       },
       email:{
           type:String,
       },
       password:{
           type:String,
       },
       phone:{
           type:String,
             

       }
}
);
const User=mongoose.model('user',UserSchema);
module.exports=User;
// user=name of model