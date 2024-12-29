const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    message: {type: String},
    phone2:{type:String}
}, {timestamps:true})

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;