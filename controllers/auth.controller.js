import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// Atomic operations: ensures DB writes are all-or-nothing
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            const error = new Error("Name, email, and password are required");
            error.status = 400;
            throw error;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error("User already exists");
            error.status = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (array syntax for transactions)
        const newUser = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        // Create JWT
        const token = jwt.sign(
            { userId: newUser[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0]
            }
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return next(err);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) {
            const error = new Error("Incorrect password!");
            error.status = 401;
            throw error;
        }
        const token = jwt.sign({userId: user[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(201).json({
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                user
            }
        })
    } catch (err) {
        next(err);
    }
};

export const signOut = async (req, res, next) => {
    try {
        // Implementation here later
    } catch (err) {
        next(err);
    }
};