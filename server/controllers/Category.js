const Category = require('../Models/Category')

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean()
    res.status(200).json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
const addCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: "Category name is required." })
    }
    const category =  await Category.create({ name })
    res.json(category)
  } catch (error) {
    console.error("Error adding category:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: "Category name is required." })
    }
    const category = await Category.findOne({ _id:id }).exec()
    if (!category) {
        return res.status(404).json({ message: "Category not found" })
    }
    category.name = name || category.name
    await category.save()
    res.json(category)
  } catch (error) {
    console.error("Error updating category:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findOne({ _id:id }).exec()
    if (!category) {
      return res.status(404).json({ message: "Category not found." })
    }
    await category.deleteOne()
    res.json(category)
  } catch (error) {
    console.error("Error deleting category:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = { getCategories, addCategory, updateCategory, deleteCategory }