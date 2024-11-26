const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // To associate the course with a teacher
    
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // To associate the course with questions
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
