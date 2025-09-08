import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Email should be unique
            lowercase: true,
            trim: true,
            match: [
                // Basic email regex validation
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^\+?[0-9\s\-]{7,15}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid phone number!`,
            },
            required: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            postalCode: { type: String, trim: true },
            country: { type: String, trim: true },
        },
        otp: {
            type: String,
            required: false,
        },
        otpExpires: {
            type: Date,
            required: false,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
