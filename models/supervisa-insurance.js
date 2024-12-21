const mongoose = require("mongoose");
const superInsuranceSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    citizenship: {type: String, required: true},
    preExistingCondition: {type: Boolean, required: true},
    startDateOfCoverage: {type:Date, required: true},
    rateUsed: {type: mongoose.Schema.Types.ObjectId, ref: "Rate"}
}, {timestamps: true});

const SupervisaInsurance = mongoose.model("SupervisaInsurance", superInsuranceSchema);
module.exports = SupervisaInsurance;