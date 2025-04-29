const Donor = require("../Models/Donors")


const addDonor = async (req, res) => {
    const { name, email, phone, donations } = req.body
    if (!name && !email)
        return res.status(400).json({ messange: 'name & email is must files' })
    const donor = await Donor.create({ name: name, email: email, phone: phone, donations: donations })
    res.json(donor)
}
const getAllDonors =async (req,res)=>{
    try{
        const donors =await Donor.find().lean().populate("donations",{_id:0,donor:0,__v:0}).sort({name:1})
        if(!donors)
            res.json([])
        res.json(donors)

    }
    catch(error){
        console.error("Error in getAllDonors:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}






const updateDonor = async (req, res) => {
    try {
        // קבלת הנתונים מהבקשה
        const { name, userName, email, phone, _id } = req.body;

        if (!_id) {
            res.status(400).json({ message: "Donor ID is required" });
        }



        const danotions = await Donation.findById(_id).exec()
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
module.exports = { addDonor,getAllDonors,updateDonor }
