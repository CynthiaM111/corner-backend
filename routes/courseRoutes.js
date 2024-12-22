const express = require('express');
const router = express.Router();
const { addCourse, getCoursesByTeacherId, getAllCourses, enrollInCourse, getCourseById, getStudentCourses, getTeacherCourses } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add-course', authMiddleware, addCourse);
router.get('/get-courses/:teacherId', authMiddleware, getCoursesByTeacherId);
router.get('/get-all-courses', authMiddleware, getAllCourses);
router.post('/enroll-in-courses', authMiddleware, enrollInCourse);
router.get('/get-student-courses', authMiddleware, getStudentCourses);
router.get('/get-course/:courseId', authMiddleware, getCourseById);
router.get('/get-teacher-courses', authMiddleware, getTeacherCourses);
module.exports = router;
