const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const methodOdverride = require("method-override");
const nodemailer = require("nodemailer");
// const bodyParser = require("body-parser");

const {SupervisaInsurance, LifeInsurance, RRSP, Contact, Rate } = require("./models")

const uri = process.env.MONGODB_LOCAL;
mongoose.connect(uri);
const db = mongoose.connection;
db.once("open",()=> console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
db.on("error", (error)=> console.log("Database error\n", error));

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOdverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.json())

app.get("/", (req, res) => {
    res.render("app/home");
});

const transporter = nodemailer.createTransport({
    host: "smtp.elasticemail.com",
    port: 2525,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    debug:true,
})

app.get("/supervisa", (req, res) => {
    res.render("app/supervisa", {message: null})
});

app.post("/supervisa", async(req, res) => {
    try {
        const { name, email, phone,  dateOfBirth, citizenship, preExistingCondition, startDateOfCoverage} = req.body;

        console.log("Request body:", req.body);


        const parsedDate = new Date(dateOfBirth);
        if (isNaN(parsedDate)) {
            return res.status(400).send("Invalid date format for dateOfBirth.");
        }

        if( !name || !email || !phone || !parsedDate ||!citizenship || !preExistingCondition || !startDateOfCoverage) {
            return res.status(400).send("All fields required")
        };

        const insuranceData = new SupervisaInsurance({
            name, email, phone, 
            dateOfBirth: parsedDate,
            citizenship, 
            preExistingCondition: preExistingCondition === "true",
            startDateOfCoverage: new Date(startDateOfCoverage)
        });

        await insuranceData.save();

        let rate = await Rate.findOne({insuranceType: "Supervisa"});

        if(!rate) {
            rate = new Rate({
                insuranceType: "Supervisa",
                baseRate: 100,
            });
            await rate.save();
        };
        let quote = rate.baseRate;
        const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
        if(age>= 60) {
            quote +=50;
        }
        if( preExistingCondition === "true") {
            quote *=1.2
        }
        if ( citizenship === "India") {
            quote *= 1.3
        }

        let rangeNegative = quote - 100;
        let rangePositive = quote + 100;


        rate.baseRate = 100;
        await rate.save();

        insuranceData.rateUsed = rate._id;
        await insuranceData.save();

       

        const superVisaInsurance = {
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME,
            subject: "New  Life Insurance from submission",
            text: `You have new Life Insurance form submission:\n\n
            Name: ${name}\n
            Email: ${email}\n
            Phone: ${phone}\n
            Date of birth: ${parsedDate}\n
            CitizenShip: ${citizenship}\n
            Preexisting Condition: ${preExistingCondition}\n
            Start Date of Coverage: ${startDateOfCoverage}
            `
        }
        
        await transporter.sendMail(superVisaInsurance);
        res.render("app/supervisa", {message: `Your quote in the range of ${rangeNegative} to ${rangePositive}. We will be contacting you asap`} )


        // res.send(` Your quote is: ${quote}`)

    } catch (error) {
        console.log("error finding the quote", error)
    }
})

app.get("/lifeInsurance", (req, res) => {
    res.render("app/lifeInsurance", {message: null})
})

app.post("/lifeInsurance", async(req, res) => {
    try {
        const {name, email, phone, dateOfBirth, smokingStatus, gender, annualIncome, coverageAmount, beneficiaries  } = req.body

        console.log("request body", req.body)

        if(!name || !email || !phone || !dateOfBirth || !smokingStatus || !gender || !annualIncome || !coverageAmount || !beneficiaries) {
            return res.status(400).send("All fields required")
        }


        const lifeInsurancedata = new LifeInsurance({
            name, email, phone, dateOfBirth: new Date(dateOfBirth), gender, smokingStatus, annualIncome, coverageAmount, beneficiaries
        });

        await lifeInsurancedata.save();

        let rate = await Rate.findOne({insuranceType: "lifeInsurance"});

        if(!rate) {
            rate = new Rate({
                insuranceType: "lifeInsurance",
                baseRate: 100,
            });
            await rate.save();
        }

        let quote = rate.baseRate;

        

        const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
        if( age >= 60) {
            quote += 60;
        }
        if( annualIncome <= 30000) {
            quote +=40
        }
        if( coverageAmount >= 1000) {
            quote += 40
        }
        if( smokingStatus === "Smoker") {
            quote +=10
        }

        let rangePositive = quote + 100;
        let rangeNegative = quote - 100;
        let parsedDate = new Date(dateOfBirth);
        
        // if(isNan(parsedDate)) {
        //     return res.status(400).status("Invalid date format for dateOfBirth.")
        // }

        rate.baseRate = 100;
        await rate.save();

        lifeInsurancedata.rateUsed = rate._id;
        await lifeInsurancedata.save();

        
        const mailLifeInsurance = {
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME,
            subject: "New  Life Insurance from submission",
            text: `You have new Life Insurance form submission:\n\n
            Name: ${name}\n
            Email: ${email}\n
            Phone: ${phone}\n
            Date of birth: ${parsedDate}\n
            Smokin Status: ${smokingStatus}\n
            Gender: ${gender}\n
            Annual Income: ${annualIncome}\n
            Coverage Amount: ${coverageAmount}\n
            Beneficiaries: ${beneficiaries}
            ` 
        }

        await transporter.sendMail(mailLifeInsurance);
        res.render("app/lifeInsurance", {message: `Your quote in the range of ${rangeNegative} to ${rangePositive}` })

        // res.send(`Your quote is: ${quote}`)

    } catch (error) {
        console.log("error finding the quote", error )        
    }
});

app.get("/contact", (req, res) => {
   res.render("app/contact", { message: null })
})

app.post("/contact", async(req, res) => {
    
    const { firstName, lastName, phone, email, message} = req.body;
    try {
        if(!firstName || !lastName || !email || !phone || !message ) {
            return res.status(400).send("All fields are required");
        }

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME,
            subject: "New Contact from submission",
            text:`You have a new contact form submission:\n\n
              Name: ${firstName} ${lastName}\n
              Email: ${email}\n
              Phone: ${phone}\n
              Message: ${message}`
              }
            await transporter.sendMail(mailOptions);
            res.render("app/contact", { message: "Thank you for contacting us! We will get back to you shortly." });

    } catch (error) {
        console.log("error", error)
    }     
})


const server = app.listen(PORT, () => {
    console.log("You are listening on PORT", PORT)
});