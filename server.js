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
    createdAt: { type: Date, default: Date.now },

    favorites: [
        {
            sourceName: { type: String, required: true },
            destinationName: { type: String, required: true },
            distanceText: { type: String, required: true }, // Stores the km string from your map
            numberOfDays: { type: Number, required: true },
            numberOfTravelers: { type: Number, required: true },
            budgetStyle: { type: String, required: true },   // "Luxury", "Standard", etc.
            calculatedBudget: { type: Number, required: true },
            savedAt: { type: Date, default: Date.now }
        }
    ]
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

// 👈 6. UPDATED SAVE FAVORITE TRIP ROUTE
app.post('/api/favorites', async (req, res) => {
    try {
        const { 
            email, 
            sourceName, 
            destinationName, 
            distanceText, 
            numberOfDays, 
            numberOfTravelers, 
            budgetStyle, 
            calculatedBudget 
        } = req.body;

        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.json({ success: false, message: "User not found!" });
        }

        // 🔍 DUPLICATE DETECTION CHECK
        const isDuplicate = foundUser.favorites.some(trip => 
            trip.destinationName.toLowerCase() === destinationName.toLowerCase() &&
            trip.sourceName.toLowerCase() === sourceName.toLowerCase()
        );

        if (isDuplicate) {
            return res.json({ 
                success: false, 
                message: `You've already saved your itinerary to ${destinationName}!` 
            });
        }

        const newTripLog = {
            sourceName,
            destinationName,
            distanceText,
            numberOfDays,
            numberOfTravelers,
            budgetStyle,
            calculatedBudget
        };

        foundUser.favorites.push(newTripLog);
        await foundUser.save();

        res.json({ success: true, message: "Trip saved successfully!" });

    } catch (error) {
        console.error("❌ Failed to save favorite:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
});

//  GET USER FAVORITES ROUTE (FOR THE DASHBOARD)
app.get('/api/favorites', async (req, res) => {
    try {
        // Grab the email sent through the URL query parameter (e.g., ?email=user@gmail.com)
        const userEmail = req.query.email;

        if (!userEmail) {
            return res.json({ success: false, message: "Email parameter is missing!" });
        }

        // Search MongoDB for our user record matching that email
        const foundUser = await User.findOne({ email: userEmail });

        if (!foundUser) {
            return res.json({ success: false, message: "User account not found!" });
        }

        // 🎉 SUCCESS: Send their exact saved itineraries array back to the dashboard!
        console.log(`📡 Dispatched ${foundUser.favorites.length} saved trips to dashboard for: ${userEmail}`);
        
        res.json({ 
            success: true, 
            favorites: foundUser.favorites 
        });

    } catch (error) {
        console.error("❌ Failed to fetch favorites profile data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
});

// 🚀 THE POWER SWITCH: START THE SERVER 🚀

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Spark Travels Server is running on port ${PORT}!`);
});