const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
require('dotenv').config({path:'../config.env'})
const fetchSeller = require('../middleware/seller_authentication');
router.get('/fetchallproducts', async (req, res) => {
  try {
    const productlist = await Product.find({"status":"unsold"});
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






router.post('/uploadproduct', fetchSeller, async (req, res) => {
  try {
    const product = await Product.create({
            sellerid:req.seller.id,
            image: req.body.image,
            title: req.body.title,
            description: req.body.description,
            category:req.body.category,
            price:req.body.price,
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

module.exports = router;