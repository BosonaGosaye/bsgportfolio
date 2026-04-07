const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config(); // Load env vars from .env in current dir

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const args = process.argv.slice(2);
        const email = args[0] || 'bosgo2121@gmail.com';
        const password = args[1] || '1q2w3e4r5t';

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const user = await User.create({
            email,
            password,
        });

        console.log(`Admin user created: ${user.email}`);
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedAdmin();
