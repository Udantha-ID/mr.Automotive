import express from 'express';
import mongoose from 'mongoose';
import { Payment } from '../model/Payment.js';

const router = express.Router();

// Route for new payment
router.post('/', async (req, res) => {
  try {
    const { cusName, Vehicle_Number, PaymentDate, PaymentMethod, Booking_Id, Package, Pamount, email } = req.body;

    if (!cusName || !Vehicle_Number || !PaymentDate || !PaymentMethod || !Booking_Id) {
      return res.status(400).send({
        message: 'Send all required fields: cusName, Vehicle_Number, PaymentDate, PaymentMethod, Booking_Id',
      });
    }

    const newPayment = new Payment({
      cusName,
      Vehicle_Number,
      PaymentDate,
      PaymentMethod,
      Booking_Id,
      Package,
      Pamount,
      email,
    });

    const payment = await newPayment.save();
    return res.status(201).send(payment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// GET route for retrieving payments based on search criteria, pagination, and sorting
router.get("/payments", async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", sort = "PaymentId" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      $or: [
        { PaymentId: { $regex: new RegExp(search, 'i') } },
        { PaymentDate: { $regex: new RegExp(search, 'i') } },
        { Vehicle_Number: { $regex: new RegExp(search, 'i') } },
        { PaymentMethod: { $regex: new RegExp(search, 'i') } },
      ],
    };

    const payments = await Payment.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ count: payments.length, data: payments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Route for all the payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({});
    return res.status(200).json({
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for retrieving a specific Payment by ID or cusName
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const paymentByID = await Payment.findById(identifier);
      if (paymentByID) {
        return res.status(200).json(paymentByID);
      }
    }

    const paymentByCusName = await Payment.find({ cusName: identifier });
    if (paymentByCusName.length > 0) {
      return res.status(200).json(paymentByCusName);
    }

    return res.status(404).json({ message: 'Payment not found' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching payment: ' + error.message });
  }
});

// In your Express router file (e.g., payment.js)
router.get('/get/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Fetching payments for email:', email); // Debug log

    // Perform a case-insensitive search for payments by email
    const payments = await Payment.find({ email: email.toLowerCase() });

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this email' });
    }

    return res.status(200).json({
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error.message); // Debug log
    res.status(500).send({ message: 'Error fetching payments: ' + error.message });
  }
});




// Route for update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cusName, Vehicle_Number, PaymentDate, PaymentMethod, Booking_Id, Pamount, email, Package } = req.body;

    if (!cusName || !Vehicle_Number || !PaymentDate || !PaymentMethod || !Booking_Id) {
      return res.status(400).send({
        message: 'Send all required fields: cusName, Vehicle_Number, PaymentDate, PaymentMethod, Booking_Id',
      });
    }

    const result = await Payment.findByIdAndUpdate(id, {
      cusName,
      Vehicle_Number,
      PaymentDate,
      PaymentMethod,
      Booking_Id,
      Pamount,
      email,
      Package
    }, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Payment.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    return res.status(200).send({ message: "Payment deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
