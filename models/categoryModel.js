import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        ancestors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
    },
    { timestamps: true }
);

CategorySchema.pre("save", async (next) => {
    if (this.parent) {
        try {
            const parentCategory = await this.constructor.findById(this.parent).exec();
            if (parentCategory) {
                this.ancestors = [...parentCategory.ancestors, this.parent];
            }
        } catch (error) {
            return next(error);
        }
    } else {
        this.ancestors = [];
    }
    next();
});

export default mongoose.model("Category", CategorySchema);
