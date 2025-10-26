const Ps = require("../models/psSchema");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
router.route("/ps");

const getReservations = async (num) => {
  const asset = await Ps.findOne({ num });
  if (!asset) throw new Error("Asset not found");
  return asset.Reservations || {};
};

router.put("/ps/y", async (req, res) => {
  try {
    const { date, tp, name, num, color, admin } = req.body;
    let assetResv = await getReservations(num);

    // If the date does not exist, create a new reservation entry
    if (!assetResv[date]) {
      assetResv[date] = {
        [color]: tp,
        Resvs: [{ name, tp, color, index: 1 }],
      };
    } else {
      // Validate 'tp' only if the user is not an admin
      if (!admin) {
        for (let i of tp) {
          if (
            assetResv[date].yellow?.includes(i) ||
            assetResv[date].red?.includes(i)
          ) {
            return res.status(400).json({ sts: "fail", error: "tp" });
          }
        }
      }

      let yellowtp = assetResv[date][color] || [];
      let redtp = assetResv[date].red || [];
      let allResvs = assetResv[date].Resvs || [];

      // Find if 'tp' already exists in reservations
      let match = allResvs.find((x) => x.tp.toString() === tp.toString());

      if (match) {
        // Remove existing 'tp' from yellow and red lists
        yellowtp = yellowtp.filter((i) => !tp.includes(i));
        redtp = redtp.filter((i) => !tp.includes(i));

        // Remove the existing reservation and insert the updated one
        let updatedResvs = allResvs.filter(
          (i) => i.tp.toString() !== tp.toString()
        );
        let changedResv = { name, tp, color, index: match.index };
        updatedResvs.push(changedResv);

        assetResv[date] = {
          red: redtp,
          yellow: [...yellowtp, ...tp], // Add new tp to yellow
          Resvs: updatedResvs,
        };
      } else {
        // Create a new reservation entry
        yellowtp = [...yellowtp, ...tp];

        let newResv = { name, tp, color, index: allResvs.length + 1 };
        assetResv[date] = {
          red: redtp,
          yellow: yellowtp,
          Resvs: [...allResvs, newResv],
        };
      }
    }

    // Update the database with modified reservations
    await Ps.updateOne({ num }, { $set: { Reservations: assetResv } });

    res.status(200).json({ sts: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sts: "fail", error: error.message });
  }
});

router.get("/ps/:id", async (req, res) => {
  try {
    const object = await Ps.findOne({ num: req.params.id });

    if (!object) {
      return res.status(404).json({ sts: "fail", error: "Object not found" });
    }

    res.status(200).json({ sts: "ok", object });
  } catch (error) {
    res.status(500).json({ sts: "fail", error: error.message });
  }
});

// Function to safely fetch and modify reservations

// Route for handling 'red' reservations
router.put("/ps/r", async (req, res) => {
  try {
    const { date, tp, name, num, color, admin } = req.body;
    let assetResv = await getReservations(num);
    if (!assetResv[date]) {
      assetResv[date] = {
        [color]: tp,
        Resvs: [{ name, tp, color, index: 1 }],
      };
    } else {
      if (!admin) {
        for (let i of tp) {
          if (
            assetResv[date].yellow?.includes(i) ||
            assetResv[date].red?.includes(i)
          ) {
            return res.status(400).json({ sts: "fail", error: "tp" });
          }
        }
      }

      let yellowtp = assetResv[date].yellow || [];
      let redtp = assetResv[date][color] || [];
      let allResvs = assetResv[date].Resvs || [];

      let match = allResvs.find((x) => x.tp.toString() === tp.toString());

      if (match) {
        redtp = [...redtp.filter((i) => !tp.includes(i)), ...tp];
        yellowtp = yellowtp.filter((i) => !tp.includes(i));

        let updatedResvs = allResvs.filter(
          (i) => i.tp.toString() !== tp.toString()
        );
        updatedResvs.push({ name, tp, color, index: match.index });

        assetResv[date] = { red: redtp, yellow: yellowtp, Resvs: updatedResvs };
      } else {
        redtp = [...redtp, ...tp];
        yellowtp = yellowtp.filter((i) => !tp.includes(i));

        let newResv = { name, tp, color, index: allResvs.length + 1 };
        assetResv[date] = {
          red: redtp,
          yellow: yellowtp,
          Resvs: [...allResvs, newResv],
        };
      }
    }

    await Ps.updateOne({ num }, { $set: { Reservations: assetResv } });
    res.status(200).json({ sts: "ok" });
  } catch (error) {
    res.status(500).json({ sts: "fail", error: error.message });
  }
});

// Route for handling 'green' reservations
router.put("/ps/g", async (req, res) => {
  try {
    const { date, tp, num, admin } = req.body;
    let assetResv = await getReservations(num);

    if (!assetResv[date]) {
      return res.status(400).json({
        sts: "fail",
        error: "No reservations found for the given date",
      });
    }

    let allResvs =
      assetResv[date].Resvs?.filter((i) => i.tp.toString() !== tp.toString()) ||
      [];

    if (allResvs.length === 0) {
      assetResv[date] = { red: [], yellow: [], Resvs: [] };
    } else {
      if (!admin) {
        for (let i of tp) {
          if (
            assetResv[date].yellow?.includes(i) ||
            assetResv[date].red?.includes(i)
          ) {
            return res.status(400).json({ sts: "fail", error: "tp" });
          }
        }
      }

      let yellowtp =
        assetResv[date].yellow?.filter((i) => !tp.includes(i)) || [];
      let redtp = assetResv[date].red?.filter((i) => !tp.includes(i)) || [];

      assetResv[date] = { red: redtp, yellow: yellowtp, Resvs: allResvs };
    }

    await Ps.updateOne({ num }, { $set: { Reservations: assetResv } });
    res.status(200).json({ sts: "ok" });
  } catch (error) {
    res.status(500).json({ sts: "fail", error: error.message });
  }
});

module.exports = router;
