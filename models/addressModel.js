import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
    {
        address1: {
            type: String,
            required: true,
            trim: true,
        },
        address2: {
            type: String,
            trim: true,
        },
        landmark: String,
        city: String,
        province: String,
        country: String,
        pincode: String,
    },
    { timestamps: true }
);

export default mongoose.model("Address", AddressSchema);
