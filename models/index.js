const mongoose = require("mongoose");
require("dotenv").config();
console.log("--PRINT--", process.env.MONGODB_LOCAL);

const uri = process.env.MONGO_ATLAS_URI;

const clientOptions = {serverAPi: {version: '1', strict:true, deprecationErrors: true}};
async function run() {
    try {
       // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
       await mongoose.connect(uri, clientOptions);
       await mongoose.connection.db.admin().command({
        ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!") 
    }finally{

    }
}
run().catch(console.dir);

const SupervisaInsurance = require("./supervisa-insurance");
const LifeInsurance = require("./life-insurance");
const Contact = require("./contact");
const RRSP = require("./RRSP");
const Rate = require("./rate");

const db= mongoose.connection;
db.once("open", () => console.log(`Connected to MongoDb at ${db.host}: ${db.port}`));
db.on("error", (error)=> console.log("Database error \n", error));

module.exports = {
    SupervisaInsurance, LifeInsurance, Contact, RRSP, Rate
}
