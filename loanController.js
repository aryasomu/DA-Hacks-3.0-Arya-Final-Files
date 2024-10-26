const wolframService = require("../services/wolframService");

exports.calculateLoan = async (req, res) => {
    const { principal, rate, years } = req.body;

    if (!principal || !rate || !years) {
        return res.status(400).json({ message: "Please provide principal, rate, and years for loan calculation." });
    }

    try {
        const loanDetails = await wolframService.calculateLoan(principal, rate, years);

        res.json(loanDetails);
    } catch (error) {
        console.error("Loan calculation error:", error.message);
        res.status(500).json({ message: "Error calculating loan details." });
    }
};
