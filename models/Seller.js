const mongoose=require('mongoose');
const {Schema}=mongoose;

const SellerSchema=new Schema({
       
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
             
       },
       role:{
           type:String,
       }
}
);
const Seller=mongoose.model('seller',SellerSchema);
module.exports=Seller;
// user=name of model