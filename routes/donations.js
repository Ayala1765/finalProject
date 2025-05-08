const express=require("express")
const router=express.Router()
const Donation=require("../controllers/Donation")
router.post("/",Donation.addDonation)
router.get("/",Donation.getAllDonations)
router.put("/",Donation.updateDonation)
router.delete("/",Donation.deleteDonation)
module.exports=router