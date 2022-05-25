const mongoose=require('mongoose');
const {Schema}=mongoose;

const PaymentSchema=new Schema({
    orderid:{
        type:String,
    },
    paymentid:{
        type:String
    },
    buyerid:{
        type:String,
        
    },
    buyername:{
        type:String,
       
    },
    buyergmail:{
        type:String,
        
    },
    buyerphone:{
        type:String,
       
    },
    sellerid:{
        type:String,
       
    },
    sellername:{
        type:String,
       
    },
    sellergmail:{
        type:String,
        
    },
    sellerphone:{
        type:String,
        
    },
    productid:{
        type:String,
       
    },
    producttitle:{
        type:String,
       
    },
    productcategory:{
        type:String,
        
    },
    productbid:{
        type:String,
        
    },
    date:{
        type:Date,
        default:Date.now()
    },

}
);
const Payment=mongoose.model('payment',PaymentSchema);
module.exports=Payment;