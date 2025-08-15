import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register=async(req,res)=>{
    try{
        const {fullname,username,password,confirmPassword,gender}=req.body;
        if(!fullname || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({message:"All fields are required"})
        }
        if(password !== confirmPassword){ 
            return res.status(400).json({message:"Password do not match"})

        }
        const user=await User.findOne({username})
        if(user){
            return res.status(400).json({message:"Username already exit try different"})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const maleProfilePhoto=`https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto=`https://avatar.iran.liara.run/public/girl?username=${username}`;



        await User.create({
            fullname,
            username,
            password:hashedPassword,
            profilePhoto:gender==="male"?maleProfilePhoto:femaleProfilePhoto,
            gender

        })
        res.status(201).json({
            
            message:"User registered successfully",
          
        })

    } catch(error){
        console.log(error);


    }

}