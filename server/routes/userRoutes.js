const express = require('express');
const router = express.Router();



// Controller functions
const getUserData = (req, res) => {
    const userId = parseInt(req.query.id); // Assuming user ID is passed as a query parameter
    const user = users.find(u => u.id === userId);

    if (user) {
        res.status(200).json({ success: true, data: user });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

const updatePassword = (req, res) => {
    const userId = parseInt(req.body.id); // Assuming user ID is passed in the request body
    const newPassword = req.body.password;

    const user = users.find(u => u.id === userId);

    if (user) {
        user.password = newPassword; // Update the password
        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

// Routes
router.get('/user', getUserData); // Route to get user data
router.put('/user/password', updatePassword); // Route to update password

module.exports = router;
const deleteUser = (req, res) => {
    const userId = parseInt(req.body.id); // Assuming user ID is passed in the request body

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove the user from the array
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

router.delete('/user', deleteUser); // Route to delete user