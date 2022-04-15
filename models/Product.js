const mongoose=require('mongoose');
const {Schema}=mongoose;

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
    //    status sold unsold
       status:{
           type:String, 
           default:"unsold" 
       },

       //purchased by contain id of buyer
       purschasedby:{
           type:String,
           default:"Not purchased yet"
       }

}
);
const Product=mongoose.model('product',ProductSchema);
module.exports=Product;
// user=name of model