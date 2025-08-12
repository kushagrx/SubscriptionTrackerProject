import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

//atomic operations: database operations that update the state are atomic, all nothing
export const signUp = async (req, res,next) => {
    const session=await mongoose.startSession();  //atomic operation
    session.startTransaction();

    try{
        const{name, email, password}=req.body;
        const existingUser = await User.findOne({email});

        //Check if a user already exists
        if(existingUser){
            const error=new Error("User already exists");
            error.status=409;
            return next(error);
        }

        //Hash password
        const salt=await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);

        const newUser = await User.create([{name, email, password: hashedpassword}],{session:session});

        const token=jwt.sign({userid:newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success:true,
            message:"User created successfully",
            data:{
                token,
                user:newUser[0]
            }
        });

    }
    catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
    }

}

export const signIn = async (req, res) => {

}

export const signOut = async (req, res) => {

}