import BookingModel from "../model/Booking.model.js";

export const createBooking = async (req, res) => {
  try {
    const booking = new BookingModel(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking Created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Create a  new Booking",
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Bookings Data", error });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await BookingModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking Deleated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Booking Log", error });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const booking = await BookingModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Booking Log", error });
  }
};

export const getBookingsByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const bookings = await BookingModel.find({ cusEmail: email.toLowerCase() });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this email" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Bookings Data", error });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const response = await BookingModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
