const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Certification = require('../models/Certification');

// @desc    Get all data for the home page
// @route   GET /api/home
// @access  Public
const getHomeData = async (req, res) => {
    try {
        const [profile, education, experience, projects, skills, blogs, services, certifications] = await Promise.all([
            Profile.findOne(),
            Education.find().sort({ startDate: -1 }),
            Experience.find().sort({ startDate: -1 }),
            Project.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(3),
            Skill.find().sort({ category: 1, order: 1 }), // Get ALL skills, sorted by category and order
            Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(3),
            Service.find({ featured: true }).limit(3),
            Certification.find().sort({ issueDate: -1 })
        ]);

        res.json({
            profile,
            education,
            experience,
            projects,
            skills,
            blogs,
            services,
            certifications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHomeData };
