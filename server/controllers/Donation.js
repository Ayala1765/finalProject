const Donation = require("../Models/Donation")
const Donor = require("../models/Donor")
const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_USER,
            pass: process.env.OUTLOOK_PASS,
        },
    })

    const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: to,
        subject: subject,
        html: html,
        replyTo: '',
    }
    console.log(to)
    try {
        console.log('Sending email...')
        const response = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully:', response)
        return response
    } catch (error) {
        console.error('Error in sendEmail:', error.message)
        throw error
    }
}

const addDonation = async (req, res) => {
    try {
        const { donationAmount, coinType, notes, donorId, event, Day } = req.body
        console.log(req.body)
        if (!donorId) {
            return res.status(400).json({ message: "Donor ID is required" })
        }
        if (!donationAmount || donationAmount <= 0) {
            return res.status(400).json({ message: "Donation amount must be greater than 0." })
        }
        const donation = await Donation.create({
            donationAmount,
            coinType,
            notes,
            donorId,
            event,
            Day: Day ? Day : ""
        })
        const donor =  await Donor.findById(donation.donorId).lean()
        console.log(donor)
        if (donor) {
            await sendEmail(donor.email, 'Keren Y&Y', 'Thank you for your donation, more people in need will smile because of you!')
            res.status(201).json(donation)
            }
    } catch (error) {
        console.error("Error in addDonation:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }


}
const getAllDonations = async (req, res) => {
    try {
    const donations = await Donation.find().populate('donorId', 'name email').lean().sort({ donationDate: -1 })
        if (!donations || donations.length === 0) {
            return res.json([])
        }
        res.json(donations)
    } catch (error) {
        console.error("Error in getAllDonations:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
const getByDonorId = async (req, res) => {
    const { donorId } = req.params
    if (!donorId) {
        return res.status(400).json({ message: "Donor ID is required" })
    }
    try {
        const donations = await Donation.find({ donorId }).sort({ donationDate: 1 }).lean()
        if (!donations.length)
            res.json([])
        res.json(donations)
    }
    catch (error) {
        console.error("Error in getByDonorId:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
const updateDonation = async (req, res) => {
    try {
        const { donationAmount, coinType, Day, notes, donationId, donorId, event } = req.body

        if (!donationId) {
            return res.status(400).json({ message: "Donation ID is required" })
        }
        const donation = await Donation.findById(donationId).exec()
        if (!donation) {
            return res.status(404).json({ message: "Donation not found" })
        }

        const donor = await Donor.findOne({ _id: donation.donorId }).exec()

        if (donorId) {
            donor = await Donor.findOne({ userName: donorId }).exec()
        }
        donation.donationAmount = donationAmount || donation.donationAmount
        donation.coinType = coinType || donation.coinType
        donation.Day = Day || donation.Day
        donation.notes = notes || donation.notes
        donation.donorId = donor._id
        donation.event = event || donation.event
        await donation.save()
        res.json({ message: "Donation updated successfully", donation })
    } catch (error) {
        console.error("Error in updateDonation:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
const deleteDonation = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            res.status(400).json({ message: "donations ID is required" })
        }
        const donations = await Donation.findById(_id).exec()
        await donations.deleteOne()
        res.send("succses")
    } catch (error) {
        console.error("Error in deleteDonation:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
module.exports = { addDonation, getAllDonations, getByDonorId, updateDonation, deleteDonation }