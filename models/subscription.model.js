import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        minlength: 5,
        maxlength: 5,
    },
    price:{
        type: Number,
        required: [true, 'Subscription price is required'],
        min:[0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['INR', 'USD'],
        default: 'INR',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment','lifestyle', 'technology']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment methods are required'],
        trim: true,
    }
})