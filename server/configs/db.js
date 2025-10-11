const mongoose = require("mongoose");

module.exports = async () => {
    try { 
        console.log("debug: ", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch(err) {
        console.error("MongoDb connection error: ", err.message);
        process.exit(1);
    }
}
