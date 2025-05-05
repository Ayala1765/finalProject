const express=require("express")
const router=express.Router()
const Donation=require("../controlers/Donation")
router.post("/",Donation.addDonation)
router.get("/",Donation.getAllDanotions)
router.put("/",Donation.updateDonation)
router.delete("/",Donation.deleteDonation)
module.exports=router