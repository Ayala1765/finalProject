const Event = require("../Models/Event")
const addEvent = async (req, res) => {
    const { name, description } = req.body
    if (!name)
        return res.status(400).json({ messange: 'name is must files' })
    const event = await Event.create({ name: name, description: description })
    res.json(event)
}
const getAllEvent = async (req, res) => {
    try {
        const event = await Event.find().lean().sort({ name: 1 })
        if (!event)
            res.json([])
        res.json(event)
    }
    catch (error) {
        console.error("Error in getAllEvent:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteEvent = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            res.status(400).json({ message: "event ID is required" });
        }
        const event = await Event.findById(_id)
        await event.deleteOne()
        res.send("succses")
    } catch (error) {
        console.error("Error in deleteEvent:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateEvent = async (req, res) => {
    try {
        const { name, description, _id } = req.body;
        if (!_id) {
            res.status(400).json({ message: "Event ID is required" });
        }
        const event = await Event.findById(_id).exec()
        event.name = name
        event.description = description
        await event.save()
        res.json(event)
    } catch (error) {
        console.error("Error in updateEvent:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { addEvent, getAllEvent, deleteEvent, updateEvent }
