const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
require('dotenv').config({path:'../config.env'})
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchSeller = require('../middleware/seller_authentication');
const jwt_secret = process.env.MYJWTTOKENSELLER;
const Product = require('../models/Product');
const User =require('../models/User');
const sendMessage = require('../SendMessage');
// const fetchUser = require('../middleware/authentication');
//creating user where authentication is not required
router.post('/createseller',body('phone').isMobilePhone().isLength({min:"10"}), async (req, res) => {
  let success=false;
   //check the error is present or not if yes return bad request
  const errors= validationResult(req);
  if(!errors.isEmpty())
      return res.status(400).json({message:"invailed phone"})
  let seller = await Seller.findOne({ email: req.body.email });
    if (seller) {
      return res.status(400).json({ message: "sorry email already exists",success });
    }   
  let sellerp = await Seller.findOne({ phone: req.body.phone });
    if (sellerp) {
      return res.status(400).json({ message: "sorry phone already exists",success });
    }   
   //if not then create user   
  const hash = await bcrypt.hash(req.body.password, 10);
 
  
  success=true;
  seller = await Seller.create({
    name: req.body.name,
    password: hash,
    email: req.body.email,
    phone:req.body.phone,
    role:req.body.role
  });
  const data = {
    seller: {
      id:seller.id
    }
  }
  const jwtdata = jwt.sign(data, jwt_secret);
  console.log(jwtdata);
  res.json({auth_token:jwtdata,success,role:seller.role});

});

//login user where login is not required
router.post('/login', async (req, res) => {
  let success=false;
  const { emailphone, password } = req.body;
  try {
    const seller1 = await Seller.findOne({ email: emailphone })
    const seller2 =await Seller.findOne({phone: emailphone})
    const seller= await seller1||seller2
    //const pass=await User.findOne({password:password});
    if (!seller)
      return res.status(400).json("opps no email found try agian");
    const passcomp = await bcrypt.compare(password, seller.password);
    if (!passcomp)
      return res.status(400).json("opps no password found try agian");
    const data =
    {
      seller: {
        id: seller.id
      }
    }
    const jwtdata = jwt.sign(data, jwt_secret);
    success=true;
    console.log(jwtdata);
       res.status(200).json({token:jwtdata,success:success,name:seller.name,role:seller.role,id:seller.id});

  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
  }

});
// router to get loggedin user details using post method where login is required
// router.post('/userdetails', fetchUser, async (req, res) => {
//   try {
//     const userid = req.user.id
//     const user = await User.findById(userid).select("-password");
//     res.status(200).json(user);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send("internal server error");
//   }

// })

//fetchsellerproduct
router.get('/fetchsellerproduct',fetchSeller, async (req, res) => {
  let success=false;
  try {
    const sellerproduct=await Product.find({"sellerid":req.seller.id,"status":"unsold","purchasedby":{$ne:"Not purchased yet"}})
    //const pass=await User.findOne({password:password});
    if (!sellerproduct)
      return res.status(400).json({message:"something went wrong"});
         return res.status(200).send(sellerproduct)  
    

  } catch (error) {
    console.log(error);
    res.status(400).json({message:"internal server error"});
  }

});
//fetchsellerproduct


//fetchsellersoldproduct
router.get('/fetchsellersoldproduct',fetchSeller, async (req, res) => {
  let success=false;
  try {
    const sellersoldproduct=await Product.find({"sellerid":req.seller.id,"status":"sold"})
    //const pass=await User.findOne({password:password});
    if (!sellersoldproduct)
      return res.status(400).json({message:"something went wrong"});
    success=true  
    return res.status(200).json({sellersoldproduct,success})  
    

  } catch (error) {
    console.log(error);
    res.status(400).json({message:"internal server error"});
  }

});

//updatestatus
router.patch('/updateapprove/:productid',fetchSeller,async(req,res)=>{
  let success=false;
  const date = new Date(Date.now()).toLocaleString(undefined,{timeZone:'Asia/Kolkata'});
  try{
    const updateproduct=await Product.findByIdAndUpdate(req.params.productid,{approved:true,approvaldate:date})
    if(!updateproduct)
       return res.status(400).json({message:"error occured"})
    success=true;   
    return res.status(200).json({updateproduct,success,message:"successfully sold"})   
  }
  catch(error)
  {
    console.log(error);
    res.status(400).json({message:"internal server error"});
  }

});
router.get('/sendAlert/:productid',fetchSeller,async(req,res)=>{
  let success=false;
  try {
    const getProduct=await Product.find({_id:req.params.productid,sellerid:req.seller.id,status:"sold"})
    if(!getProduct)
      return res.status(400).json({message:"error occured 1"})
    const getDetails=await User.findById(getProduct[0].purchasedby).select("-password");  
    if(!getDetails)
      return res.status(400).json({message:"error occured 2 "})
    success=true;
    console.log(getDetails)
    const{name,phone,email}=getDetails;
    sendMessage(name,phone,email)
    res.status(200).json({getDetails})  
       
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"internal server error",success})
    
  }
})


//usoldproduct
router.patch('/unsoldproduct/:productid/:bid',fetchSeller,async(req,res)=>{
  let success=false;
  try {
    const unsoldproduct=await Product.findByIdAndUpdate(req.params.productid,{status:"unsold",purchasedby:"Not purchaed yet",bid:req.params.bid})
    if(!unsoldproduct)
       return res.status(400).json({message:"something error occured",success})
    success=true
      return res.status(200).json({unsoldproduct,success,message:"unsold successfully"})

  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
    
  }
})
module.exports = router;