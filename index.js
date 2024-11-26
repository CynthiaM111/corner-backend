const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const createQuestionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Update with your frontend's URL
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/corner/auth', authRoutes);
app.use('/corner/course', courseRoutes);
app.use('/corner/course/question', createQuestionRoutes(io)); // Pass io to routes
app.use('/corner/user', userRoutes);

// Database Connection
connectDB(); // Ensure the database is connected before starting the server

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Joining a course-specific room
    socket.on('joinCourseRoom', (courseId) => {
        socket.join(courseId);
        console.log(`User joined course room: ${courseId}`);
    });

    // Broadcast new questions
    socket.on('questionAdded', (question) => {
        io.to(question.courseId).emit('newQuestion', question);
        console.log('New question broadcasted:', question);
    });

    // Broadcast new comments
    socket.on('commentAdded', ({ questionId, updatedComments }) => {
        io.to(questionId).emit('newComment', { questionId, updatedComments });
        console.log(`New comment broadcasted for question: ${questionId}`);
    });

    // Leaving the room
    socket.on('leaveCourseRoom', (courseId) => {
        socket.leave(courseId);
        console.log(`User left course room: ${courseId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
