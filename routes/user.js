const express = require('express');
const router = express.Router();
const Razorpay=require('razorpay')
const User = require('../models/User');
require('dotenv').config({path:'../config.env'})
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.MYJWTTOKENUSER;
const fetchUser = require('../middleware/user_authentication');
const Product = require('../models/Product');
const instance = new Razorpay({
  key_id: 'rzp_test_iezewoK1EFazfr',
  key_secret: 'qpGOF2Tn3j3EkIw69UBNDEpH',
});
//creating user where authentication is not required
router.post('/createuser',body('phone').isMobilePhone().isLength({min:"10"}), async (req, res) => {
  let success=false;
   //check the error is present or not if yes return bad request
  const errors= validationResult(req);
  if(!errors.isEmpty())
      return res.status(400).json({message:"invailed phone"})
  let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "sorry email already exists exists",success });
    }   
  let userp = await User.findOne({ phone: req.body.phone });
    if (userp) {
      return res.status(400).json({ message: "sorry phone already exists exists",success });
    }   
   //if not then create user   
  const hash = await bcrypt.hash(req.body.password, 10);
 
  
  success=true;
  user = await User.create({
    name: req.body.name,
    password: hash,
    email: req.body.email,
    phone:req.body.phone,
    role:req.body.role
  });
  const data = {
    user: {
      id: user.id
    }
  }
  const jwtdata = jwt.sign(data, jwt_secret);
  console.log(jwtdata);
  res.json({auth_token:jwtdata,success,role:"buyer"});

});

// login user where login is not required
router.post('/login', async (req, res) => {
  let success=false;
  const { emailphone, password } = req.body;
  try {
    const user1 = await User.findOne({ email:emailphone });
    const user2 = await User.findOne({ phone:emailphone });
    const user= await user1||user2
    //const pass=await User.findOne({password:password});
    if (!user)
      return res.status(400).json("opps no email found try agian");
    const passcomp = await bcrypt.compare(password, user.password);
    if (!passcomp)
      return res.status(400).json("opps no password found try agian");
    const data =
    {
      user: {
        id: user.id
      }
    }
    const jwtdata = jwt.sign(data, jwt_secret);
    success=true;
    console.log(jwtdata);
       res.status(200).json({token:jwtdata,success:success,name:user.name,role:user.role,id:user.id});

  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
  }

});
// router to get loggedin user details using post method where login is required
router.get('/userdetails', fetchUser, async (req, res) => {
  try {
    const userid = req.user.id
    const user = await User.findById(userid).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("internal server error");
  }

})

router.put('/bid/:productid/:bid',fetchUser,async(req,res)=>{
  try{
  let success=false;
  const userid=req.user.id;
  const privprice=await Product.findById(req.params.productid);
  if(parseInt(req.params.bid)<=parseInt(privprice.bid))
     return res.status(400).json({message:"bid should be more than base price",success}); 
  const updateproduct0=await Product.findByIdAndUpdate(req.params.productid,{bid:req.params.bid,purchasedby:userid})
  if(!updateproduct0)
      return res.status(400).json({message:"something went wrong",success});        
  const updateproduct=await Product.findByIdAndUpdate(req.params.productid,{$push: {bidhistory: {bname:userid, bamt: req.params.bid}}})
  console.log(updateproduct)
  if(!updateproduct)
     return res.status(400).json({message:"something error occured",success})
  success=true
     return res.status(200).json({updateproduct,success})  
  }catch(error)
    {
      console.log(error)
      res.status(400).json({message:"internal server errror"});
    } 


})

router.get('/order/:productid',fetchUser,async(req,res)=>{
  
  try {
    let success=false;
    const product=await Product.findById(req.params.productid);
    if(!product)
      return res.status(400).json({message:"error",success})
    const amount=product.bid*100;
    const currency="INR";
    instance.orders.create({amount,currency},(error,order)=>{
      if(error)
        return res.status(400).json({message:"error",success})
      success=true;  
        return res.status(200).json({order:order,success})  
        
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"internal server error"})
    
  }
})
// router.post('/verify_payment',async(req,res)=>{
//   console.log(JSON.stringify(req.body));
//   console.log(req.body.payload.payment.entity.method);
//   const crypto=require('crypto');
//   const hash=crypto.createHmac('SHA256','ganpatSINGH22@#')
//   .update(JSON.stringify(req.body))
//   .digest('hex');
//   console.log(hash);
//   console.log(req.headers["x-razorpay-signature"]);
//   res.status(200);
// })
//---------------------------------------


router.get('/wishlist2',fetchUser,async(req,res)=>{
  try {
    let success=false;
    const userid=req.user.id;
    if(!userid)
      return res.status(400).json({message:"error occured"})
    const wishlist=await Product.find({"status":"unsold","bidhistory.bname":req.user.id})  ;
    if(!wishlist)
      return  res.status(400).json({message:"error occured",success})
    success=true;
    res.status(200).json({wishlist,success})  
  } catch (error) {
    console.log(error);
    res.status(400).json("internal server error");
    
  }
})

//---------------------------------------


//my store

router.get('/mystore',fetchUser,async(req,res)=>{
  try {
    let success=false;
    const userid=req.user.id;
    if(!userid)
      return res.status(400).json({message:"error occured"})
    const mystore=await Product.find({"purchasedby":userid,"status":"sold"})  ;
    if(!mystore)
      return  res.status(400).json({message:"error occured"})
    success=true;
    res.status(200).json({mystore,success})  
  } catch (error) {
    console.log(error);
    res.status(400).json("internal server error");
    
  }
})

module.exports = router;