const Donation = require("../Models/Donation")
const Donor = require("../Models/Donors")
const addDonationToDonor = async (donationData, donorId) => {
    try {
        // מציאת התורם לפי ID
        const donor = await Donor.findById(donorId)
        if (!donor) {
            throw new Error("Donor not found");
        }

        // יצירת תרומה חדשה וקישור לתורם
        const donation = await Donation.create({ ...donationData, donor: donorId })
        donor.donations.push(donation._id)
        await donor.save()
        // return donation;
    } catch (error) {
        console.error("Error adding donation:", error.message);
        throw error;
    }
};

const addDonation = async (req, res) => {
    try {
        // קבלת הנתונים מהבקשה
        const { donationAmount, coinType, Day, notes, donorId } = req.body;

        // ולידציה לשדות חובה
        if (!donorId) {
            res.status(400).json({ message: "Donor ID is required" });
        }
        if (!donationAmount) {
            res.status(400).json({ message: "Donation amount is required" });
        }

        // יצירת תרומה וקישור לתורם
        const donationData = { donationAmount, coinType, Day, notes };
        const donation = await addDonationToDonor(donationData, donorId);
        res.send("succses")
    } catch (error) {
        console.error("Error in addDonation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllDanotions = async (req, res) => {
    try {
        const danotions = await Donation.find().lean().sort({ donationDate: 1 })
        if (!danotions)
            res.json([])
        res.json(danotions)

    }
    catch (error) {
        console.error("Error in getAllDanotions:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}



const updateDonation = async (req, res) => {
    try {
        // קבלת הנתונים מהבקשה
        const { donationAmount, coinType, Day, notes, _id } = req.body;

        if (!_id) {
            res.status(400).json({ message: "Donor ID is required" });
        }



        const danotions = await Donation.findById(_id)
        danotions.donationAmount = donationAmount
        danotions.coinType = coinType
        danotions.Day = Day
        danotions.notes = notes
        await danotions.save()
        res.send("succses")
    } catch (error) {
        console.error("Error in addDonation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { addDonation, addDonationToDonor, getAllDanotions, updateDonation }


