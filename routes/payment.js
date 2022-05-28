const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const User = require('../models/User');
const Payment = require('../models/Payment');
var mongoose = require('mongoose');
const sendMessage = require('../SendMessage');

router.get('/makepayment/:productid/:orderid/:paymentid', async (req, res) => {
    try {
        let success = false;
        const { orderid, paymentid, productid } = req.params;
        let id = mongoose.Types.ObjectId(productid)
        const product = await Product.findById(id)
        if (!product)
            return res.status(400).json({ message: "error occured in finding product", success })
        id = mongoose.Types.ObjectId(product.purchasedby);
        const buyer=await User.findById(id)  
        if (!buyer)
            return res.status(400).json({ message: "error occured in finding buyer", success }) 
        id = product.sellerid;
        const seller=await Seller.findById(id)  
        if (!seller)
            return res.status(400).json({ message: "error occured in finding seller", success }) 
        const updateproduct=await Product.findByIdAndUpdate(productid,{status:"sold"}) 
        if(!updateproduct)   
            return res.status(400).json({message:"error occured in update status",success})
        const payment = await Payment.create({
            orderid, paymentid, productid,sellerid:product.sellerid,buyerid:product.purchasedby
            ,producttitle:product.title,productcategory:product.category,
            productbid:product.bid,buyername:buyer.name,buyergmail:buyer.email,buyerphone:buyer.phone,
            sellername:seller.name,sellergmail:seller.email,sellerphone:seller.phone
        });
        if (!payment)
            return res.status(400).json({ message: "error occured in creating payment", success })
        success = true;
        res.status(200).json({payment,success});
        sendMessage(buyer.name,product.bid,product.title,paymentid); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internel server error" })
    }
});
module.exports = router; 