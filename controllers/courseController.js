const Course = require('../models/course');
const User = require('../models/user');
const Question = require('../models/question');

const addCourse = async (req, res) => {

    const teacherId = req.teacherId;
    const { name, description } = req.body;
    try {
        const course = new Course({ name, teacherId, description });
        await course.save();
        res.status(201).json({ message: 'Course added successfully', course });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add course' });
    }
};

const getCoursesByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        // Logic to fetch courses based on teacherId
        const courses = await Course.find({ teacherId });  // Replace with your actual model and query
        if (!courses) {
            return res.status(404).json({ msg: 'Courses not found' });
        }
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

const enrollInCourse = async (req, res) => {
    const { studentId, courses } = req.body;
    try {
        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.courses = [... new Set([...student.courses, ...courses])]; // Assuming courses are an array of course IDs
        await student.save();

        res.status(200).json({ message: 'Courses selected successfully', courses: student.courses });
    } catch (error) {
        console.log('Error in enrollInCourse:', error.message, error.stack);
        res.status(500).json({ msg: 'Failed to select courses', error: error.message });
    }
};
const getCoursesByStudentId = async (req, res) => {
    
    try {
        const { studentId } = req.params;
        const student = await User.findById(studentId).populate({
            path: 'courses',
            match: {
                schoolCode: student.schoolCode
            },
            select: 'name teacherId', // fields you want to return from the course
            populate: {
                path: 'teacherId',
                select: 'name email'  // fields you want to return from the teacher
            }
        });
        if (!student) {
            console.log('Student not found');
            return res.status(404).json({ msg: 'Student not found' });
        }
        console.log("populated courses", student.courses);
        res.status(200).json({ message: 'Courses fetched successfully', courses: student.courses });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch courses', error: error.message });
    }
};
const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const {userId} = req;

        // Fetch the user's schoolCode to filter the course
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { schoolCode } = user;

        // Fetch the course ensuring it matches the schoolCode
        const course = await Course.findOne({ _id: courseId, schoolCode }).populate('teacherId');
        if (!course) {
            return res.status(404).json({ msg: 'Course not found or you do not have access to it' });
        }

        
        const questions = await Question.find({ courseId: courseId })
        .populate('createdBy')
        .populate({
            path: 'comments.author',
            select: 'name role'
        })
        .sort({ createdAt: -1 });

        const sortedQuestions = await Promise.all(
            questions.map(async (question) => {
                // Sort comments by timestamp, newest first
                question.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                return question;
            })
        );
        res.status(200).json({ course, questions: sortedQuestions });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch course and questions' });
    }
};
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacherId');
        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all courses' });
    }
};
module.exports = { addCourse, getCoursesByTeacherId, getAllCourses, enrollInCourse, getCoursesByStudentId, getCourseById };
