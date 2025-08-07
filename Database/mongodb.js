import mongoose from 'mongoose';
import {DB_URI} from "../config/env.js";

if(!DB_URI){
    throw new Error("MongoDB URI doesn't exist");
}

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URI);
    }
    catch(err){
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
export default connectToMongoDB;