const express=require("express")
const router=express.Router()
const Event=require("../controllers/Event")
router.post("/",Event.addEvent)
router.get("/",Event.getAllEvent)
router.put("/",Event.updateEvent)
router.delete("/",Event.deleteEvent)
module.exports=router

