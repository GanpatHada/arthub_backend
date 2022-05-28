const mongoose=require('mongoose');
const {Schema}=mongoose;
const bidderSchema=new Schema({bname:"String",bamt:"String"})
const ProductSchema=new Schema({
       sellerid:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"seller"
       },
       image:{
           type:String,
       },
       title:{
           type:String,
           default:"Not provided"
       },
       description:{
           type:String,
           default:"Not provided"
       },
       category:{
           type:String
       },
       price:{
           type:String,
       },
       approved:{
            type:Boolean,
            default:false
  
       },
       approvaldate:{
           type:String,
       },
    //    status sold unsold
       status:{
           type:String, 
           default:"unsold", 
       },
       bidhistory:[bidderSchema],
       bid:{
           type:String,
       },
       //purchased by contain id of buyer
       purchasedby:{
           type:String,
           default:"Not purchased yet"
       }

}
);
const Product=mongoose.model('product',ProductSchema);
module.exports=Product;
// user=name of model