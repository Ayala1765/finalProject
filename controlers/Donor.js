const Donor = require("../Models/Donor")
const addDonor = async (req, res) => {
    const { userName,name, email, phone, donations } = req.body
    if (!userName && !email)
        return res.status(400).json({ messange: 'userName & email is must files' })
    const donor = await Donor.create({ userName:userName,name: name, email: email, phone: phone, donations: donations })
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
const deleteDonor = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            res.status(400).json({ message: "Donor ID is required" });
        }
        const donor = await Donor.findById(_id)
        await donor.deleteOne()
        res.send("succses")
    } catch (error) {
        console.error("Error in deleteDonor:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateDonor = async (req, res) => {
    try {
        const { userName, name, email, phone } = req.body;
        if (!userName) {
            return res.status(400).json({ message: "Donor username is required" });
        }
        const donor = await Donor.findOne({ userName }).exec();

        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        donor.name = name || donor.name;
        donor.email = email || donor.email;
        donor.phone = phone || donor.phone;
        await donor.save();

        res.json(donor);
    } catch (error) {
        console.error("Error in updateDonor:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = { addDonor,getAllDonors,updateDonor ,deleteDonor}
