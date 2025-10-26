const express = require("express");
const router = express.Router();
const Ping = require("../models/pingSchema");
const Pool = require("../models/poolSchema");
const Ps = require("../models/psSchema");

router.get("/getall", async (req, res) => {
  try {
    const [pingT, psT, poolT] = await Promise.all([
      Ping.find(),
      Ps.find(),
      Pool.find(),
    ]);

    res
      .status(200)
      .json({ sts: "ok", all: { ping: pingT, ps: psT, pool: poolT } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sts: "fail", error: "Internal Server Error" });
  }
});

module.exports = router;
