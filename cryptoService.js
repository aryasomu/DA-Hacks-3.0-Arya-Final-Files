const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function generateJWT() {
    const payload = {
        iss: process.env.COINBASE_API_KEY,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 5
    };

    const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
        algorithm: "ES256"
    });

    return token;
}

exports.createCryptoCharge = async (name, description, amount, currency) => {
    try {
        const token = generateJWT();

        const chargeData = {
            name: name,
            description: description,
            local_price: {
                amount: amount.toString(),
                currency: currency
            },
            pricing_type: "fixed_price"
        };

        const response = await axios.post(
            "https://api.commerce.coinbase.com/charges",
            chargeData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.hosted_url;
    } catch (error) {
        throw new Error("Error creating crypto charge: " + error.message);
    }
};
