const express=require("express")
const router=express.Router()
const Donor=require("../controlers/Donor")
router.post("/",Donor.addDonor)
router.get("/",Donor.getAllDonors)
router.put("/",Donor.updateDonor)
router.delete("/",Donor.deleteDonor)
module.exports=router

