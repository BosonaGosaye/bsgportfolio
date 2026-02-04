const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./models/Profile');

dotenv.config();

const seedProfile = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const profileExists = await Profile.findOne();

        if (profileExists) {
            console.log('Profile already exists');
            process.exit();
        }

        await Profile.create({
            name: 'John Doe',
            title: 'Full Stack Developer',
            bio: 'I am a passionate developer building amazing web applications.',
            shortBio: 'Building the future, one line of code at a time.',
            profileImage: 'https://via.placeholder.com/300',
            aboutImage: 'https://via.placeholder.com/400x500',
            email: 'john@example.com',
            socialLinks: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com'
            }
        });

        console.log('Profile seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedProfile();
