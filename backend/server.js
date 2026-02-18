require("dotenv").config()
const app = require('./src/app')
const connectToDB = require("./src/config/database")

// Database connection
connectToDB()

// --- YE BADLAV HAI ---
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
