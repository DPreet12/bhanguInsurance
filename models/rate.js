const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
    insuranceType: {type: String, required: true},
    baseRate: {type: Number, required: true},
    conditions: {type: Object, default: {}},
}, {timestamps:true});

const Rate = mongoose.model("Rate", rateSchema);
module.exports = Rate;