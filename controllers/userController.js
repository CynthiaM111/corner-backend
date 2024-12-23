const User = require('../models/user');

const getUserInfo = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.userId;
        if (!user || !userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userInfo = await User.findById(userId).populate('school','name');
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            name: userInfo.name,
            role: userInfo.role,
            school: userInfo.school?.name|| "Unknown",
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserInfo };