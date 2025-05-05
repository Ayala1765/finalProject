const express=require("express")
const router=express.Router()
const Event=require("../controlers/User")


const verifyJWT=require("../middleeware/verifyJWT")

 //router.post("/",User.login)
// router.get("/",User.getAllEvent)
// router.put("/",User.updateEvent)
// router.delete("/",User.deleteEvent)
module.exports=router


