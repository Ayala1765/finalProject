const Category = require('../Models/Category');

// שליפת כל הקטגוריות
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// הוספת קטגוריה חדשה
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: "Category added successfully.", category });
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// עריכת קטגוריה קיימת
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category updated successfully.", category });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// מחיקת קטגוריה
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };