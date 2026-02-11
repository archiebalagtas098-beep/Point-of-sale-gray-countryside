import express from 'express';
import MenuItem from '../models/Menuitem.js';
import InventoryItem from '../models/InventoryItem.js';
import StockTransfer from '../models/StocktransferModel.js';

const router = express.Router();

// Staff requests stock from inventory
router.post('/request-stock', async (req, res) => {
    try {
        const { menuItemId, quantity, notes } = req.body;
        const staffId = req.user._id; // From auth middleware
        
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        
        const transfer = new StockTransfer({
            type: 'request_from_inventory',
            staffId: staffId,
            menuItemId: menuItemId,
            menuItemName: menuItem.name,
            quantity: quantity,
            status: 'pending',
            notes: notes || `Stock request for ${menuItem.name}`
        });
        
        await transfer.save();
        
        // Emit real-time notification (if using Socket.io)
        // io.emit('new_stock_request', { transfer, staff: req.user.name });
        
        res.json({
            success: true,
            message: 'Stock request submitted',
            transfer: transfer
        });
        
    } catch (error) {
        console.error('Error requesting stock:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Manager sends stock to staff
router.post('/send-to-staff', async (req, res) => {
    try {
        const { menuItemId, quantity, staffId, notes } = req.body;
        
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        
        if (menuItem.currentStock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${menuItem.currentStock}`
            });
        }
        
        // Update menu item stock
        menuItem.currentStock -= quantity;
        await menuItem.save();
        
        const transfer = new StockTransfer({
            type: 'transfer_to_staff',
            staffId: staffId,
            menuItemId: menuItemId,
            menuItemName: menuItem.name,
            quantity: quantity,
            previousStock: menuItem.currentStock + quantity,
            newStock: menuItem.currentStock,
            status: 'completed',
            notes: notes || `Stock transfer to staff`
        });
        
        await transfer.save();
        
        res.json({
            success: true,
            message: 'Stock transferred to staff',
            transfer: transfer
        });
        
    } catch (error) {
        console.error('Error sending stock to staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all pending requests (for manager)
router.get('/pending-requests', async (req, res) => {
    try {
        const requests = await StockTransfer.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .populate('staffId', 'name email');
        
        res.json({
            success: true,
            requests: requests
        });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update request status (approve/reject)
router.put('/update-request/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        
        const transfer = await StockTransfer.findById(id);
        if (!transfer) {
            return res.status(404).json({ success: false, message: 'Transfer not found' });
        }
        
        if (status === 'approved') {
            const menuItem = await MenuItem.findById(transfer.menuItemId);
            if (!menuItem) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }
            
            if (menuItem.currentStock < transfer.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock. Available: ${menuItem.currentStock}`
                });
            }
            
            // Update menu item stock
            menuItem.currentStock -= transfer.quantity;
            await menuItem.save();
            
            transfer.previousStock = menuItem.currentStock + transfer.quantity;
            transfer.newStock = menuItem.currentStock;
        }
        
        transfer.status = status;
        transfer.managerNotes = notes || '';
        transfer.processedAt = new Date();
        transfer.processedBy = req.user._id;
        
        await transfer.save();
        
        res.json({
            success: true,
            message: `Request ${status}`,
            transfer: transfer
        });
        
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get staff's stock transfers
router.get('/staff-transfers', async (req, res) => {
    try {
        const staffId = req.user._id;
        
        const transfers = await StockTransfer.find({ staffId: staffId })
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json({
            success: true,
            transfers: transfers
        });
    } catch (error) {
        console.error('Error fetching staff transfers:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;