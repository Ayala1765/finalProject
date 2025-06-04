const express = require('express')
const router = express.Router()
const Category = require('../controllers/Category')
router.get('/', Category.getCategories)
router.post('/', Category.addCategory)
router.put('/:id', Category.updateCategory)
router.delete('/:id', Category.deleteCategory)

module.exports = router