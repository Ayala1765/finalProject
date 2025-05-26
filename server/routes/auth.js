const express = require("express")
const router = express.Router()
const Auth = require("../controllers/Auth")
router.post("/login", Auth.login)
router.post("/register", Auth.register)
router.post("/resetPasswordWithCode", Auth.resetPasswordWithCode)
router.post("/sendVerificationCode", Auth.sendVerificationCode)
module.exports = router