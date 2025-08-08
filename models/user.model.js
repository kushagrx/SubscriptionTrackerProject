import mongoose from 'mongoose';
const userSchema = mongoose.Schema(
    {
        name:{
            type: String,       //Validator
            required: [true, 'Name is required'],     //error message name is required
            trim: true,    //for empty spaces, Sanitizer
            minlength: 3,
            maxlength: 50
        },
        email:{
            type: String,
            required: [true, 'Email is required'],  //Validator
            trim: true,
            unique: true,
            lowercase: true,            //Sanitizer
            match:[/^\w+([.-]?\w+)*@\w+\..+$/, 'Please enter a valid email address']       //Sanitizer
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 5,
            maxlength: 20
        }

    },
{timestamps: true}         // automatically adds createdAt and updatedAt fields and updates them on save.
);

const User = mongoose.model('User', userSchema);  //Compiles the schema into a model, allowing CRUD operations
export default User;