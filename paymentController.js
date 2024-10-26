const cryptoService = require("../services/cryptoService");

exports.processCryptoPayment = async (req, res) => {
    const { name, description, amount, currency } = req.body;

    try {
        const paymentUrl = await cryptoService.createCryptoCharge(name, description, amount, currency);

        res.json({ paymentUrl });
    } catch (error) {
        console.error("Error processing crypto payment:", error.message);
        res.status(500).json({ message: "Error processing crypto payment." });
    }
};
