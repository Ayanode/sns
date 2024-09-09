import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, // First name is required
    },
    lastName: {
        type: String,
        required: true, // Last name is required
    },
    username: {
        type: String,
        unique: true,
        // required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`,
        },
    },
    dob: {
        type: Date,
        validate: {
            validator: function (v) {
                return !isNaN(Date.parse(v));
            },
            message: props => `${props.value} is not a valid date!`,
        },
    },
    password: {
        type: String,
        required: function() { return !this.isFirebaseAuth; }, // Password required if not using Firebase Auth
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isFirebaseAuth: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model('UserSns', userSchema);

export default User;
