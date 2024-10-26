const Plot = require("../models/Plot");
const deedService = require("../services/deedService");

exports.getAllPlots = async (req, res) => {
    try {
        const plots = await Plot.find();
        res.json(plots);
    } catch (error) {
        console.error("Error fetching plots:", error.message);
        res.status(500).json({ message: "Error fetching plots." });
    }
};

exports.purchasePlot = async (req, res) => {
    const { plotId, userId, ownerAddress } = req.body;

    try {
        const plot = await Plot.findById(plotId);
        if (!plot) {
            return res.status(404).json({ message: "Plot not found." });
        }
        if (plot.status === "Sold") {
            return res.status(400).json({ message: "Plot already sold." });
        }

        const deedId = await deedService.createDeed(plotId, plot.name, plot.coordinates, ownerAddress);

        plot.ownedBy = userId;
        plot.status = "Sold";
        plot.deedId = deedId;
        await plot.save();

        res.json({ message: "Plot purchased successfully", plot });
    } catch (error) {
        console.error("Error purchasing plot:", error.message);
        res.status(500).json({ message: "Error purchasing plot." });
    }
};
