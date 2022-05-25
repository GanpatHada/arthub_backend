const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const User = require('../models/User');
const Payment = require('../models/Payment');
var mongoose = require('mongoose');
// router.get('/makepayment/:productid/:orderid/:paymentid', async (req, res) => {
//     try {
//         let success = false;
//         const {orderid,paymentid,productid}=req.params;
//         console.log(typeof(productid));
//         console.log(typeof(paymentid));
//         const product = await Product.findOne({_id:productid});
//         if(!product)
//            return res.status(400).json({message:"error occured",success});
//         const{_id,title,category,bid,purchasedby,sellerid}=product;
//         const buyerid=purchasedby;
//         const buyer=await User.findById(buyerid);
//         const{name,email,phone}=buyer;
//         const seller=await Seller.findById(sellerid);
//         const sellername=seller.name;
//         const selleremail=seller.email;
//         const sellerphone=seller.phone;
//         const p=await Payment.findOne({productid});
//         if(p)
//            return res.status(400).json({message:"error occured",success})
//         //res.status(200).json({orderid,paymentid,_id,title,category,bid,purchasedby,name,email,phone,sellerid,sellername,sellerphone,selleremail});
//         const payment = await Payment.create({
//             orderid: orderid,
//             paymentid: paymentid,
//             buyerid: purchasedby,
//             buyername: name,
//             buyergmail: email,
//             buyerphone: phone,
//             sellerid: sellerid,
//             sellername: sellername,
//             sellergmail: selleremail,
//             sellerphone: sellerphone,
//             productid:_id,
//             producttitle:title,
//             productcategory:category,
//             productbid:bid,

//         });
//         if (!payment)
//              return res.status(400).json({ message: "error occured", success })
//         success = true;
//          res.status(200).json({message:success,success});
//     } catch (error) {
//           console.log(error);
//           return res.status(500).json({message:"Internel server error"})
//     }
// });

router.get('/makepayment/:productid/:orderid/:paymentid', async (req, res) => {
    try {
        let success = false;
        const { orderid, paymentid, productid } = req.params;
        let id = mongoose.Types.ObjectId(productid)
        const product = await Product.findById(id)
        if (!product)
            return res.status(400).json({ message: "error occured", success })
        id = mongoose.Types.ObjectId(product.purchasedby);
        const buyer=await User.findById(id)  
        if (!buyer)
            return res.status(400).json({ message: "error occured", success }) 
        id = product.sellerid;
        const seller=await Seller.findById(id)  
        if (!seller)
            return res.status(400).json({ message: "error occured", success }) 
        const payment = await Payment.create({
            orderid, paymentid, productid,sellerid:product.sellerid,buyerid:product.purchasedby
            ,producttitle:product.title,productcategory:product.category,
            productbid:product.bid,buyername:buyer.name,buyergmail:buyer.email,buyerphone:buyer.phone,
            sellername:seller.name,sellergmail:seller.email,sellerphone:seller.phone
        });
        if (!payment)
            return res.status(400).json({ message: "error occured", success })
        success = true;
        res.status(200).json({payment,success});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internel server error" })
    }
});
module.exports = router; 