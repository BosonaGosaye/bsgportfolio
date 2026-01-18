const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const debugUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'bosgo2121@gmai.com';
        const password = '1q2w3e4r5t';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User NOT found:', email);
        } else {
            console.log('✅ User found:', user.email);
            console.log('Stored Password Hash:', user.password);

            const isMatch = await user.comparePassword(password);
            console.log(`Password match result (via method): ${isMatch}`);

            const directCompare = await bcrypt.compare(password, user.password);
            console.log(`Password match result (direct bcrypt): ${directCompare}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugUser();
