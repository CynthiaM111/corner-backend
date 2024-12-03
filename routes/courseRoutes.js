const express = require('express');
const router = express.Router();
const { addCourse, getCoursesByTeacherId, getAllCourses, enrollInCourse, getCoursesByStudentId, getCourseById } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add-course', authMiddleware, addCourse);
router.get('/get-courses/:teacherId', authMiddleware, getCoursesByTeacherId);
router.get('/get-all-courses', getAllCourses);
router.post('/enroll-in-courses', authMiddleware, enrollInCourse);
router.get('/get-courses/:studentId', authMiddleware, getCoursesByStudentId);
router.get('/get-course/:courseId', authMiddleware, getCourseById);

module.exports = router;
