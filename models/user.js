// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
   
    verificationCode: String,
    verificationCodeExpires: Date,
    emailVerified: { type: Boolean, default: false },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    profileIcon: String,
});

module.exports = mongoose.model('User', userSchema);
