const mongoose = require("mongoose")

const ExerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
})

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema)

module.exports = ExerciseModel
