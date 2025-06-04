const CreditDetails = require("../Models/CreditDetails")
const bcrypt = require("bcrypt")

const hashData = async (data) => {
    const saltRounds = 10
    const hashedData = await bcrypt.hash(data, saltRounds)
    return hashedData
}
const addCredit = async (req, res) => {
    try {
        const { cardHolderName, cardNumber, expirationDate, cvv } = req.body
        console.log(cardHolderName, cardNumber, expirationDate, cvv)

        if (!cardHolderName || !cardNumber || !expirationDate || !cvv) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const hashedCardNumber = await hashData(cardNumber)
        const hashedCVV = await hashData(cvv)
        const credit = await CreditDetails.create({
            cardHolderName,
            cardNumber: hashedCardNumber,
            expirationDate,
            cvv: hashedCVV,
        })

        console.log(credit)
        res.status(201).json({ message: "Credit added successfully", credit })
    } catch (error) {
        console.error("Error in addCredit:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateCredit = async (req, res) => {
    try {
        const { creditId, cardHolderName, cardNumber, expirationDate, cvv } = req.body

        if (!creditId) {
            return res.status(400).json({ message: "creditId is required" })
        }
        const credit = await CreditDetails.findById(creditId).exec()
        if (!credit) {
            return res.status(404).json({ message: "Credit not found" })
        }


        if (cardNumber) {
            const hashedCardNumber = await hashData(cardNumber)
            credit.cardNumber = hashedCardNumber
        }

        if (cvv) {
            const hashedCVV = await hashData(cvv)
            credit.cvv = hashedCVV
        }

        credit.cardHolderName = cardHolderName || credit.cardHolderName
        credit.expirationDate = expirationDate || credit.expirationDate


        await credit.save()
        res.json({ message: "Credit updated successfully", credit })
    } catch (error) {
        console.error("Error in updateCredit:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteCredit = async (req, res) => {
    try {
        const { creditId } = req.body

        if (!creditId) {
            return res.status(400).json({ message: "CreditID is required" })
        }
        const credit = await CreditDetails.findById(creditId).exec()
        if (!credit) {
            return res.status(404).json({ message: "Credit not found" })
        }
        await credit.deleteOne()
        res.json({ message: "Credit deleted successfully" })
    } catch (error) {
        console.error("Error in deleteCredit:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { addCredit, updateCredit, deleteCredit }