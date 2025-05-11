const CreditDetails = require("../models/CreditDetails")
const addCredit = async (req, res) => {
    try {
        if (!cardHolderName || !cardNumber || !expirationDate || !cvv) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const encryptedCardNumber = encrypt(cardNumber);
        const encryptedCVV = encrypt(cvv);
        const credit = await CreditDetails.create({
            cardHolderName,
            cardNumber: encryptedCardNumber.encryptedData,
            expirationDate,
            cvv: encryptedCVV.encryptedData,
            iv: encryptedCardNumber.iv 
        });        res.send("succses")
    } catch (error) {
        console.error("Error in addDonation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


const updateCredit = async (req, res) => {
    try {
        const { creditId,cardHolderName, cardNumber, expirationDate, cvv } = req.body

        if (!creditId) {
            return res.status(400).json({ message: "creditId is required" })
        }
        // חיפוש התרומה לפי donationId
        const credit = await CreditDetails.findById(creditId).exec();
        if (!credit) {
            return res.status(404).json({ message: "credit not found" })
        }
        // עדכון פרטי התרומה
        if (cardNumber) {
            const encryptedCardNumber = encrypt(cardNumber);
            credit.cardNumber = encryptedCardNumber.encryptedData;
            credit.iv = encryptedCardNumber.iv;
        }
        if (cvv) {
            const encryptedCVV = encrypt(cvv);
            credit.cvv = encryptedCVV.encryptedData;
        }
        credit.cardHolderName = cardHolderName || credit.cardHolderName;
        credit.expirationDate = expirationDate || credit.expirationDate;
        // שמירת התרומה המעודכנת
        await credit.save()
        res.json({ message: "Credit updated successfully", credit })
    } catch (error) {
        console.error("Error in updateCredit:", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteCredit = async (req, res) => {
    try {
        const { creditId } = req.body;
        if (!creditId) {
            res.status(400).json({ message: "CreditID is required" })
        }
        const credit = await CreditDetails.findById(creditId).exec()
        await credit.deleteOne()
        res.send("succses")
    } catch (error) {
        console.error("Error in deleteCredit:", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { addCredit, updateCredit, deleteCredit }


