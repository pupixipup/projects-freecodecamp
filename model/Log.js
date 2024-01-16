const mongoose = require("mongoose")

const LogSchema = new mongoose.Schema({
  username: String,
  count: { type: Number, default: 0 },
  log: [{ description: String, duration: Number, date: String }],
})

const LogModel = mongoose.model("Log", LogSchema)

module.exports = LogModel
