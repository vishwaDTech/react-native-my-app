const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().populate({
            path: 'createdBy',
            select: 'name email'
        });
        res.status(200).json({ success: true, count: destinations.length, data: destinations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }
        res.status(200).json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private/Admin
exports.createDestination = async (req, res) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const destination = await Destination.create(req.body);
        res.status(201).json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
exports.updateDestination = async (req, res) => {
    try {
        let destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
exports.deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        await destination.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
