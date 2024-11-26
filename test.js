const mongoose = require('mongoose');
const User = require('./models/user'); 
const Course = require('./models/course');

// Adjust the path to your User model

const testPopulate = async () => {
    await mongoose.connect('mongodb://localhost:27017/corner', {
        
    });

    const student = await User.findById('67352848310ecbe61205494f').populate('courses');
    console.log('Populated student:', student);
    console.log('Courses:', student.courses);

    mongoose.disconnect();
};

testPopulate();
