const express = require("express")
const router = express.Router()
const Donor = require("../controllers/Donor")
const verifyJWT = require("../middleware/verifyJWT")
router.post("/",verifyJWT ,Donor.addDonor)
router.get("/", verifyJWT,Donor.getAllDonors)
router.put("/",verifyJWT, Donor.updateDonor)
router.delete("/",verifyJWT, Donor.deleteDonor)
module.exports = router



