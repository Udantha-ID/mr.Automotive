import express from 'express';
import { RequestItem } from '../model/RequestItem.js';

const router = express.Router();

// Create a new request item
router.post('/', async (req, res) => {
    try {
        const requestItem = new RequestItem(req.body);
        await requestItem.save();
        res.status(201).json(requestItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all request items
router.get('/', async (req, res) => {
    try {
        const requestItems = await RequestItem.find();
        res.json(requestItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single request item by ID
router.get('/:id', async (req, res) => {
    try {
        const requestItem = await RequestItem.findById(req.params.id);
        if (!requestItem) {
            return res.status(404).json({ message: 'Request item not found' });
        }
        res.json(requestItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a request item by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedRequestItem = await RequestItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Ensure validators run on update
        );
        if (!updatedRequestItem) {
            return res.status(404).json({ message: 'Request item not found' });
        }
        res.json(updatedRequestItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['processing', 'received', 'failed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value. Allowed values are: processing, received, failed.' });
        }

        const updatedRequestItem = await RequestItem.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequestItem) {
            return res.status(404).json({ message: 'Request item not found' });
        }

        res.status(200).json({ message: `Request item status updated to ${status}`, requestItem: updatedRequestItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating request item status' });
    }
});

// Delete a request item by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRequestItem = await RequestItem.findByIdAndDelete(req.params.id);
        if (!deletedRequestItem) {
            return res.status(404).json({ message: 'Request item not found' });
        }
        res.json({ message: 'Request item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
