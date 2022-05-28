const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config({path:'../config.env'})
const fetchSeller = require('../middleware/seller_authentication');
var mongoose = require('mongoose');
router.get('/fetchallproducts', async (req, res) => {
  try {
    const productlist = await Product.find({"approved":false});
    if(productlist)
      {
        return res.status(200).send(productlist)
       }
    return res.status(400).json("erro occured")        
  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
  }

})
router.get('/sellerdetails/:sellerid', async (req, res) => {
  try {
    let success=false;
    const sellerdetails = await Seller.findById(mongoose.Types.ObjectId(req.params.sellerid)).select('-password');
    if(!sellerdetails)
        return res.status(400).json({message:"error occured",success})
    success=true;    
    return res.status(200).json({sellerdetails,success})        
  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
  }

})
router.get('/buyerdetails/:purchasedby', async (req, res) => {
  try {
    let success=false;
    const buyerdetails = await User.findById(mongoose.Types.ObjectId(req.params.purchasedby)).select('-password');
    if(!buyerdetails)
        return res.status(400).json({message:"error occured",success})
    success=true;    
    return res.status(200).json({buyerdetails,success})        
  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
  }

})






router.post('/uploadproduct', fetchSeller, async (req, res) => {
  try {
    const product = await Product.create({
            sellerid:req.seller.id,
            image: req.body.image,
            title: req.body.title,
            description: req.body.description,
            category:req.body.category,
            price:req.body.price,
            bid:req.body.price,
            status:req.body.status,
            purchasedby:req.body.purchasedby
          });
    if(product)
       return res.status(200).json({message:"uploaded successfully",success:true}) 
    return res.status(400).json({message:"uploaded failed",success:false})        
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"internal server error",success:false});
  }

})
router.get('/productdetails/:productid',async(req,res)=>{
  try {
    let success=false
    const product=await Product.findById(mongoose.Types.ObjectId(req.params.productid))
    if(!product)
      res.status(400).json({message:"something error occured"})
    success=true;
    res.status(200).json({product,success})

  } catch (error) {
     console.log(error);
     res.status(500).json('Internal server error');
    
  }
})


//bid history api
router.get('/bidhistory/:productid',async(req,res)=>{
  try {
    let success=false
    const product=await Product.findById(req.params.productid)
    if(!product)
      res.status(400).json({message:"something error occured"})
    success=true;
    console.log(product.bidhistory);
    res.status(200).json(product.bidhistory)

  } catch (error) {
     console.log(error);
     res.status(500).json('Internal server error');
    
  }
})

module.exports = router;