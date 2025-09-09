import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: String,
        price: {
            type: Number,
            required,
        },
        stock: { type: Number, default: 0 },
        images: [String],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
