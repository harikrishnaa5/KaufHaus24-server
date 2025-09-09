import Category from "../models/categoryModel";

export default categoryController = {
    getAllCategory: async (req, res) => {
        try {
            const allCategories = await Category.find();
            return res.status(200).json({ data: allCategories });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    },
    create: async (req, res) => {
        const { name, parent } = req.body;
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: "Category name should not be empty" });
        }
        try {
            const trimmedName = name.trim();
            const existingCategory = await Category.findOne({ name: trimmedName });
            if (existingCategory) {
                return res
                    .status(409)
                    .json({ message: `Category by the name '${trimmedName}' is already taken. Try a new name.` });
            }

            const newCategoryData = { name: trimmedName };
            if (parent) {
                newCategoryData.parent = parent;
            }

            const newCategory = new Category(newCategoryData);
            await newCategory.save();

            return res.status(201).json({ message: "Successfully created new category", category: newCategory });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    },
};
