import express from 'express';
import mongoose from 'mongoose';

import { Customer } from '../model/Customer.js';

const router = express.Router();

// Create a new customer
router.post('/', async (request, response) => {
    try {
        const newCustomer = {
            image: request.body.image,
            cusID: request.body.cusID,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            NIC: request.body.NIC,
            phone: request.body.phone,
            cusEmail: request.body.cusEmail,
            password: request.body.password,
        };

        const customer = await Customer.create(newCustomer);

        return response.status(201).send(customer);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get all customers

router.get('/', async (request, response) => {
    try {
        const customers = await Customer.find({});

        return response.json(customers);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get a single customer
router.get('/:identifier', async (request, response) => {
    try {
        // Extracting the identifier from the request parameters
        const { identifier } = request.params;

        // Checking if the provided identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // Fetching a vehicle from the database based on the ID
            const cuByID = await Customer.findById(identifier);
            if (cuByID) {
                // Sending the fetched vehicle as a JSON response if found by ID
                return response.status(200).json(cuByID);
            }
        }

        // If the provided identifier is not a valid ObjectId, try searching by register number
        const customerByCUSID = await Customer.findOne({ cusID: identifier });
        if (customerByCUSID) {
            // Sending the fetched vehicle as a JSON response if found by register number
            return response.status(200).json(customerByCUSID);
        }

        // If no vehicle found by either ID or register number, send a 404 Not Found response
        return response.status(404).json({ message: 'Customer not found' });
    } catch (error) {
        // Handling errors and sending an error response with detailed error message
        console.error(error);
        response.status(500).send({ message: 'Error fetching Customer: ' + error.message });
    }
});

// Update a customer

router.put('/:id', async (request, response) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );

        if (!customer) return response.status(404).send({ message: 'Customer not found' });

        return response.json(customer);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Delete a customer

router.delete('/:id', async (request, response) => {
    try {
        const customer = await Customer.findByIdAndDelete(request.params.id);

        if (!customer) return response.status(404).send({ message: 'Customer not found' });

        return response.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.post('/cLogin', async (request, response) => {
    try {
        const { cusID, password } = request.body;
        if (!cusID || !password) {
            return response.status(400).json({ message: 'cusID and password are required' });
        }
        const customer = await Customer.findOne({ cusID });
        if (!customer) {
            return response.status(404).json({ message: 'User not found' });
        }
        if (password !== customer.password) {
            return response.status(401).json({ message: 'Incorrect password' });
        }
        response.status(200).json(customer);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;