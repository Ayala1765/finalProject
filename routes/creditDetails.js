const express = require("express")
const router = express.Router()
const CreditDetails = require("../controllers/CreditDetails")
router.post("/", CreditDetails.addCredit)
router.put("/", CreditDetails.updateCredit)
router.delete("/", CreditDetails.deleteCredit)
module.exports = router