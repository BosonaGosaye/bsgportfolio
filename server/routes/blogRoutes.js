const express = require('express');
const router = express.Router();
const { 
  getBlogs, 
  createBlog, 
  getBlogBySlug, 
  incrementViews,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.get('/slug/:slug', getBlogBySlug);
router.patch('/views/:id', incrementViews);

module.exports = router;
