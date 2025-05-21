require('dotenv').config();
const Donation = require('../Models/Donation');
const Donor =require("../models/Donor")
const addDonor =
    async (req, res) => {
        try {
            if (!req.user || req.user.role !== 'manager') {
                return res.status(403).json({ error: 'Access denied' })
            }
            const { name, username, email, phone, role, password } = req.body
            if (!username || !email || !password)
                return res.status(400).json({ messange: 'username & email & password is must files' })
            console.log(name, username, email, phone, role, password)
            const donor = await Donor.create({ name: name, username: username, password: password, role: role, email: email, phone: phone })
            res.json(donor)
        } catch (error) {
            res.status(500).json({ error: 'Error adding donor' });
        }
    }
const getAllDonors =
    async (req, res) => {

         try {
           
            if (!req.user || req.user.role !== 'manager') {  
                return res.status(403).json({ error: 'Access denied' })
            }
            const donors = await Donor.find().lean().sort({ name: 1 });
            console.log(donors);
    
            const allDonation = await Promise.all(
                donors.map(async (item,index) => {
                    const children = await Donation.find({ donorId: item._id });
                    return { ...item, children,index:index };
                })
            );
            console.log(allDonation);
            if (!allDonation || allDonation.length === 0){
                res.json([])
            }

            res.json(allDonation)
        }
        catch (error) {
            console.error("Error in getAllDonors:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    }

const deleteDonor =
    async (req, res) => {
        try {
            if (!req.user || req.user.role !== 'manager') {
                return res.status(403).json({ error: 'Access denied' })
            }
            const { _id } = req.body;
            if (!_id) {
                res.status(400).json({ message: "Donor ID is required" })
            }
            const donor = await Donor.findById(_id)
            if (!donor) {
                return res.status(404).json({ message: "Donor not found" })
            }
            await donor.deleteOne()
            res.send("succses")
        } catch (error) {
            console.error("Error in deleteDonor:", error.message)
            res.status(500).json({ message: "Internal server error" })
        }
    }

const updateDonor =
    async (req, res) => {
        try {
            if (!req.user || req.user.role !== 'manager') {
                return res.status(403).json({ error: 'Access denied' })
            }
            const { donorId, name, username, password, email, phone } = req.body
            const donor = await Donor.findOne({ _id:donorId }).exec()
            if (!donor) {
                return res.status(404).json({ message: "Donor not found" })
            }
            donor.name = name || donor.name
            donor.username = username || donor.username
            donor.email = email || donor.email
            donor.phone = phone || donor.phone
            donor.password = password || donor.password
            await donor.save()
            res.json(donor)
        } catch (error) {
            console.error("Error in updateDonor:", error.message)
            res.status(500).json({ message: "Internal server error" })
        }
    }
module.exports = { addDonor, getAllDonors, updateDonor, deleteDonor }

