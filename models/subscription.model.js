import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema(
    {
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
    },
    status:{
        type:String,
        required: [true, 'Status is required'],
        enum: ['active','canceled','expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value<= new Date(),
            message: 'Invalid start date. Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;    //this is used to refer to the model itself
            },
            message: 'Renewal date must be after the start date.',
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,      //accepting the id
        ref: 'User',                    //by referencing the user model
        required: true,
        index: true,                    //to optimize the queries by indexing the user field
    }
},
{timestamps:true});



