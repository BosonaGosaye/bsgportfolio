const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Message = require('../models/Message');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    const blogStats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const totalViews = blogStats.length > 0 ? blogStats[0].totalViews : 0;

    // Data for charts
    // Blog views per post (Top 5)
    const blogViewsData = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views');

    // Project popularity (Top 5)
    const projectPopularityData = await Project.find()
      .sort({ popularity: -1 })
      .limit(5)
      .select('title popularity');

    // Recent message trend (count per day for last 7 days)
    // This is a more complex aggregation, but for now we'll return recent messages
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProjects,
        totalBlogs,
        totalMessages,
        totalViews
      },
      charts: {
        blogViews: blogViewsData,
        projectPopularity: projectPopularityData
      },
      recentMessages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };
