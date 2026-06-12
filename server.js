require('dotenv').config(); // Loads the .env variables immediately on boot-up
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 👈 1. Import Mongoose

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 👈 2. CONNECT TO LOCAL MONGODB
// This creates a database named 'spark_travels_db' on your machine automatically!
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("🍃 MongoDB database connected successfully!"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// 👈 3. DEFINE THE USER BLUEPRINT (SCHEMA)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique ensures no duplicate accounts!
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the compilation Model based on the schema blueprint
const User = mongoose.model('User', userSchema);


// Existing dummy test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the Spark Travels backend server engine!" });
});


// 👈 4. UPDATE THE SIGNUP ROUTE TO SAVE TO MONGODB
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create a new document instance using our Mongoose Model
        const newUser = new User({
            name: name,
            email: email,
            password: password // In production, we would hash this, but plain text is fine for testing!
        });

        // Save it directly into the database hard drive storage
        await newUser.save();

        console.log(`✅ User permanently saved to database: ${email}`);

        res.json({ 
            success: true, 
            message: "Account created and permanently stored inside MongoDB!" 
        });

    } catch (error) {
        console.error("❌ Database insertion failed:", error);
        
        // Handle duplicate email errors gracefully
        if (error.code === 11000) {
            return res.json({ success: false, message: "Email is already registered!" });
        }
        
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
});

// 5. THE LOGIN VERIFICATION ROUTE
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Search MongoDB to see if a user with this email exists
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.json({ success: false, message: "No account found with this email address!" });
        }

        // 2. If the user exists, check if their database password matches what they typed
        if (foundUser.password !== password) {
            return res.json({ success: false, message: "Incorrect password! Please try again." });
        }

        // 3. Both checkpoints cleared! Success!
        console.log(`🔑 User logged in successfully: ${foundUser.email}`);
        
        // 👇 UPDATE THIS EXACT SECTION BELOW 👇
        res.json({ 
            success: true, 
            name: foundUser.name, // 👈 ADD THIS LINE so index.js can catch the actual user name string!
            message: `Welcome back to Spark Travels, ${foundUser.name}! Login successful.` 
        });

    } catch (error) {
        console.error("❌ Login processing error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
});

// Turn on the server engine
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Spark Travels Server is running on port ${PORT}!`);
    console.log(`===================================================`);
});