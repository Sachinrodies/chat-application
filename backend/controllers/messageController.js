import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

export const sendMessage=async(req,res)=>{
    try{
        const senderId=req.id;
        const receiverId=req.params.id;
        const {message}=req.body;
        let gotConversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        if(!gotConversation){
            gotConversation=await Conversation.create({
                participants:[senderId,receiverId]
            })
        };
        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);

            
        }
        await gotConversation.save();
        return res.status(200).json({
            message:"Message sent successfully",
          
            newMessage
        })
        //SOCKET IO
       
        



    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}
export const getMessage=async(req,res)=>{
    try{
        const receiverId=req.params.id;
        const loggedInUserId=req.id;
        const conversation =await Conversation.findOne({
            participants:{$all:[loggedInUserId,receiverId]}
        }).populate("messages");
      return res.status(200).json(conversation?.messages)

    }catch(error){
        console.log(error);
    }
}