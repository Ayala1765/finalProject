require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Donor = require("../models/Donor")
const nodemailer = require('nodemailer')

const register = async (req, res) => {
  try {
    const { name, username, password, email, phone } = req.body
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password and email are required.' })
    }
    const existingDonor = await Donor.findOne({ email })
    if (existingDonor) {
      return res.status(400).json({ error: 'Email already exists.' })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const newDonor = await Donor.create({
      name,
      username,
      password: hashedPassword,
      email,
      phone,
    })
    res.json(newDonor)
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration.' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const donor = await Donor.findOne({ email })
    if (!donor) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }
    const isMatch = await bcrypt.compare(password, donor.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign({ id: donor._id, role: donor.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
    const userData = {
      _id: donor._id,
      name: donor.name,
      username: donor.username,
      email: donor.email,
      phone: donor.phone,
      role: donor.role
    }
    res.status(200).send({ token, user: userData, role: donor.role })
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' })
  }
}

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
          user: process.env.OUTLOOK_USER, 
          pass: process.env.OUTLOOK_PASS 
      }
  })
  const mailOptions = {
      from: process.env.OUTLOOK_USER,
      to,
      subject,
      html
  }
  await transporter.sendMail(mailOptions)
}

const verificationCodes = {}

const sendVerificationCode = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' })
  }
  try {
    const user = await Donor.findOne({ email }).exec()
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    const verificationCode = crypto.randomInt(100000, 999999)
    verificationCodes[email] = verificationCode
    const emailHtml = `
      <p>Your password reset verification code is: <strong>${verificationCode}</strong></p>
      <p>If you did not request this, please ignore this email.</p>
    `
   await sendEmail(email, 'Password Reset Verification Code', emailHtml)
    res.status(200).json({ message: 'Verification code sent to email.' })
  } catch (err) {
    res.status(500).json({ message: 'Error sending verification code.', error: err.message })
  }
}

const resetPasswordWithCode = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body
  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({ message: 'Email, verification code, and new password are required.' })
  }
  try {
    if (verificationCodes[email] !== parseInt(verificationCode)) {
      return res.status(400).json({ message: 'Invalid verification code.' })
    }
    const user = await Donor.findOne({ email }).exec()
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    delete verificationCodes[email]
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password.', error: err.message })
  }
}
module.exports = { register, login, resetPasswordWithCode, sendVerificationCode,sendEmail }