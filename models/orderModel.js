import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: { type: Number, required: true, default: 1 },
                totalAmount: { type: Number, required: true },
                status: { type: String, default: "Pending" },
            },
        ],
    },
    { timestamps }
);

export default mongoose.model("Order", OrderSchema);
