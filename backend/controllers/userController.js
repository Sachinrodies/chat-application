import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

};
export const login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({username})
        if(!user){
            return res.status(400).json({message:"User not found",
                success:false
            })
        };
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid password",
                success:false
            })
        };
        const tokenData={
            id:user._id,

        }
        const token=await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
        return res.status(200).cookie("token",token,{maxAge:1000*60*60*24,httpOnly:true,sameSite:"strict"}).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePhoto:user.profilePhoto,
           
        })

       

    } catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error",
            success:false
        })
    }
};

export const logout=async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
        })

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error",
            success:false
        })

    }

};
export const getUser=async(req,res)=>{
    try{
        const loggedInUserId=req.id;
        const otherUser=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json({
           
            otherUser
        })



    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error",
            success:false
        })
    }

}