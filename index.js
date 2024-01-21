const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require("dotenv").config()
const User = require("./model/User")
const Log = require("./model/Log")
const Exercise = require("./model/Exercise")

mongoose.connect(process.env.MONGO_URL)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

app.post("/api/users", async (req, res) => {
  const name = req.body.username
  const user = await User.create({ username: name })
  await Log.create({ username: user.username, count: 0, log: [] })
  res.json(user)
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id
  const description = req.body.description
  const duration = req.body.duration
  const date =
    req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
  const user = await User.findById(id).exec()
  await Log.updateOne(
    { username: user.username },
    { $inc: { count: 1 }, $push: { log: { description, duration, date } } }
  ).exec()

  await Exercise.create({
    description,
    duration,
    date,
    username: user.username,
  })
  res.json({
    _id: user._id,
    username: user.username,
    description,
    duration,
    date,
  })
})

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id
  const { from, to, limit   } = req.query;

  const query = {}

  const date = {}
  if (from) date.$gte = new Date(from)
  if (to) date.$lte = new Date(to)

  if (Object.keys(date).length) {
    query.date = date;
  }

  const {_id, username} = await User.findById(id);
  query.username = username;
  const {log, count} = await Log.findOne({ username })
  let exercises = await Exercise.find(query).limit(parseInt(limit))
  exercises = exercises.map((x) => ({
    description: x.description,
    duration: x.duration,
    date: new Date(x.date).toDateString()
  }))
  console.log(exercises)
  res.json({ _id, username, log: exercises, count })
})

app.get("/api/users", async (req, res) => {
  const users = await User.find().exec()
  res.json(users)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})