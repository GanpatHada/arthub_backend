const jwt=require('jsonwebtoken');
const jwt_secret=process.env.MYJWTTOKENSELLER;
const fetchSeller=(req,res,next)=>{
   //get the user from jwt token and append userid to request
   const token=req.header('auth-token');
   if(!token)
      return res.status(401).json("invailed authentication your token is invaled");
    try{ 
    const data=jwt.verify(token,jwt_secret);
    req.seller=data.seller;
    next();
    }catch(error){
        console.log(error);
       res.status(400).json("internal server error in token");
    }
}

module.exports=fetchSeller