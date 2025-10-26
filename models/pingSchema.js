const mongoose = require("mongoose");

const pingSchema = new mongoose.Schema({
  Reservations: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
  num: { type: Number, required: true },
});

const Ping = mongoose.model("Ping", pingSchema);

module.exports = Ping;
