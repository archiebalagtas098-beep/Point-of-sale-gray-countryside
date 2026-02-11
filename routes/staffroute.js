import express from 'express';
import MenuItem from '../models/Menuitem.js';
import StaffAssignment from '../models/staffassignModel.js';

const router = express.Router();

// Get staff profile
router.get('/profile', async (req, res) => {
    try {
        res.json({
            success: true,
            staff: req.user // From auth middleware
        });
    } catch (error) {
        console.error('Error getting staff profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get staff assigned items
router.get('/assigned-items', async (req, res) => {
    try {
        const staffId = req.user._id;
        
        const assignments = await StaffAssignment.find({ staffId: staffId, status: 'active' })
            .populate('menuItemId');
        
        const items = assignments.map(assignment => {
            const item = assignment.menuItemId.toObject();
            return {
                ...item,
                assignedQuantity: assignment.assignedQuantity,
                lastUpdated: assignment.updatedAt
            };
        });
        
        res.json({
            success: true,
            items: items
        });
    } catch (error) {
        console.error('Error getting assigned items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Request item assignment
router.post('/request-assignment', async (req, res) => {
    try {
        const { menuItemId } = req.body;
        const staffId = req.user._id;
        
        const existingAssignment = await StaffAssignment.findOne({
            staffId: staffId,
            menuItemId: menuItemId,
            status: { $in: ['active', 'pending'] }
        });
        
        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: 'Already assigned or pending assignment'
            });
        }
        
        const assignment = new StaffAssignment({
            staffId: staffId,
            menuItemId: menuItemId,
            status: 'pending',
            assignedQuantity: 0
        });
        
        await assignment.save();
        
        res.json({
            success: true,
            message: 'Assignment request submitted',
            assignment: assignment
        });
    } catch (error) {
        console.error('Error requesting assignment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get available items (for staff)
router.get('/available-items', async (req, res) => {
    try {
        const staffId = req.user._id;
        
        // Get all active menu items
        const allItems = await MenuItem.find({ isActive: true });
        
        // Get staff's assigned items
        const assignments = await StaffAssignment.find({
            staffId: staffId,
            status: 'active'
        }).select('menuItemId');
        
        const assignedItemIds = assignments.map(a => a.menuItemId.toString());
        
        // Filter out assigned items
        const availableItems = allItems.filter(item => 
            !assignedItemIds.includes(item._id.toString())
        );
        
        res.json({
            success: true,
            items: availableItems
        });
    } catch (error) {
        console.error('Error getting available items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;