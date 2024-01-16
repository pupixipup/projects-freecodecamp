const mongoose = require("mongoose")

const ExerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
})

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema)

module.exports = ExerciseModel
