const mongoose = require("mongoose");

const poolSchema = new mongoose.Schema({
  Reservations: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
  num: { type: Number, required: true },
});

const Pool = mongoose.model("Pool", poolSchema);

module.exports = Pool;
