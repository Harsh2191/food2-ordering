import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js";

const  router = express.Router();

//router for user registration
router.post('/register',async(req,res) =>{
  try{

    const {email,password}=req.body;
    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).send({msg:"user already exits"});
    }
    const hashedPassword = await bcrypt.hash(password,12)

    const newUser = new User({
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({id:savedUser._id},process.env.JWT_SECRET,{expiresIn: "1h"});

    res.status(201).json({token, msg:"user regitered successfully"});


  } catch (error){
    console.log(error);
    res.status(500).send("server error");
  }
})

// route for user login

router.post('/login', async(req,res)=>{
try{
  const {email,password}=req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).send({msg:"invalid credential"});
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if(isMatch){
    const payload={
      id:user._id,
      email:user.email
    };
    jwt.sign(payload,
      process.env.JWT_SECRET,
      {expiresIn:3600},
      (error,token)=>{
        if(error) throw error;
        res.json({
          token,
          user:{id:user._id,email:user.email}
        })
      }
    )
  }
  else{
    return res.status(400).json({masg:"invalid credential"});
  }
} catch(error){
  console.log(error);
    res.status(500).send("server error");
}
});

export {router as authRouter};