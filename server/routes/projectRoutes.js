const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject, 
  getProjectBySlug, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.get('/slug/:slug', getProjectBySlug);

module.exports = router;
