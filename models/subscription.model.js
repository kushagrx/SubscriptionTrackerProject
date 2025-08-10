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

//Auto calculate the renewal date in case its missing. This function will do that
subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate){
        const renewalPeriods={
            daily:1,
            weekly:7,
            monthly:31,
            yearly:365,
        };

        this.renewalDate=new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);

    }
    //Auto updates the status if renewal date has passed

    if(this.renewalDate<new Date()){
        this.status = 'expired';
    }
    next();
})

const Subscription = mongoose.model('Subscription',subscriptionSchema);
export default Subscription;