const Supported = require('../Models/supported')


const getSupported = async (req, res) => {
  try {
    const supported = await Supported.find().populate('category', 'name').lean()
    res.status(200).json(supported)
  } catch (error) {
    console.error("Error fetching supported:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}


const addSupported = async (req, res) => {
  try {
    const { name, contactName, contactPhone, category } = req.body

    if (!name ||  !contactPhone || !category) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const supported = new Supported({ name, contactName, contactPhone, category })
    await supported.save()

    res.status(201).json({ message: "Supported added successfully.", supported })
  } catch (error) {
    console.error("Error adding supported:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

const updateSupported = async (req, res) => {
  try {
    const { id } = req.params
    const { name, contactName, contactPhone, category } = req.body

    if (!name ||  !contactPhone || !category) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const supported = await Supported.findByIdAndUpdate(
      id,
      { name, contactName, contactPhone, category },
      { new: true }
    )

    if (!supported) {
      return res.status(404).json({ message: "Supported not found." })
    }

    res.status(200).json({ message: "Supported updated successfully.", supported })
  } catch (error) {
    console.error("Error updating supported:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteSupported = async (req, res) => {
  try {
    const { id } = req.params

    const supported = await Supported.findByIdAndDelete(id)
    if (!supported) {
      return res.status(404).json({ message: "Supported not found." })
    }
    res.status(200).json({ message: "Supported deleted successfully." })
  } catch (error) {
    console.error("Error deleting supported:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
module.exports = { getSupported, addSupported, updateSupported, deleteSupported }