const mongoose = require("mongoose");

const lifeInsuranceQuoteSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    smokingStatus: {type: String,  enum:["Smoker", "Non-Smoker"], required: true},
    gender: {type: String, required: true},
    annualIncome: {type: Number, required: true},
    coverageAmount: {type: Number, required: true},
    beneficiaries: {type: Number, required: true}
}, {timestamps:true});

const LifeInsurance = mongoose.model("LifeInsurance", lifeInsuranceQuoteSchema);
module.exports = LifeInsurance;