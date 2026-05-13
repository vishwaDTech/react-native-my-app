const User = require('../models/User');
const Destination = require('../models/Destination');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a user (Admin/SuperAdmin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Prevent non-superadmins from creating other admins or superadmins
        if (req.user.role !== 'superadmin' && (role === 'admin' || role === 'superadmin')) {
            return res.status(403).json({ 
                success: false, 
                message: 'Only Super Admins can create Admin accounts' 
            });
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create an admin user
// @route   POST /api/users/create-admin
// @access  Private/SuperAdmin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create user with admin role
        const user = await User.create({
            name,
            email,
            password,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Authorization check
        if (req.user.role !== 'superadmin' && user.role !== 'user') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
        }

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Authorization check
        if (req.user.role !== 'superadmin' && user.role !== 'user') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this user' });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle favorite destination
// @route   POST /api/users/favorites/:destinationId
// @access  Private
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const destination = await Destination.findById(req.params.destinationId);

        if (!destination) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        const isFavorite = user.favorites.includes(req.params.destinationId);

        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(
                (id) => id.toString() !== req.params.destinationId
            );
        } else {
            // Add to favorites
            user.favorites.push(req.params.destinationId);
        }

        await user.save();

        res.status(200).json({
            success: true,
            isFavorite: !isFavorite,
            data: user.favorites
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user favorite destinations
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');

        res.status(200).json({
            success: true,
            count: user.favorites.length,
            data: user.favorites
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
