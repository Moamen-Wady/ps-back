const mongoose = require("mongoose");

const psSchema = new mongoose.Schema({
  Reservations: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
  num: { type: Number, required: true },
});

const Ps = mongoose.model("Ps", psSchema);

module.exports = Ps;
