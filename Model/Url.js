const mongoose = require("mongoose");
const counterModel = require("./Counter");

const UrlSchema = new mongoose.Schema(
    {
        original_url: String,
        position: { type: Number, default: 0 }
    }
);

UrlSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await counterModel.findByIdAndUpdate(
                { _id: 'url_position_counter' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            this.position = counter.sequence_value;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Url = mongoose.model("Url", UrlSchema);

module.exports = Url;
