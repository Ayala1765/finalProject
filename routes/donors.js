const express=require("express")
const router=express.Router()
const Donor=require("../controlers/Donor")

router.post("/",Donor.addDonor)
router.get("/",Donor.getAllDonors)
module.exports=router

