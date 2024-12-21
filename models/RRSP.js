const mongoose = require("mongoose");

const rrspSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    currentRrspInvestments: {type: Number, required: true},
    annualRrspINvestments: {type: Number, required: true},
    annualAnticipatedRateOfReturn: {type: Number, required: true},
    numberOfYearsToRetirement: {type: Number, required: true}
}, {timestamps:true});

const RRSP = mongoose.model("RRSP", rrspSchema);
module.exports = RRSP;