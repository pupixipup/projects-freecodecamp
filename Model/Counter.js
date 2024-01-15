const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});

const counterModel = mongoose.model('Counter', CounterSchema);

module.exports = counterModel;