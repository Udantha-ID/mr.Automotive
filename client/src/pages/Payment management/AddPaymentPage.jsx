import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import emailjs from "emailjs-com";

const AddPaymentPage = () => {
  const [cusName, setcusName] = useState("");
  const [Vehicle_Number, setVehicle_Number] = useState("");
  const [PaymentDate, setPaymentDate] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [Booking_Id, setBooking_Id] = useState("");
  const [Package, setPackage] = useState("");
  const [Pamount, setPamount] = useState(0);
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split('T')[0]; // Get the max date in YYYY-MM-DD format

  const sendEmailToCustomer = () => {
    const emailConfig = {
      serviceID: "service_3p901v6",
      templateID: "template_cwl7ahv",
      userID: "-r5ctVwHjzozvGIfg",
    };

    emailjs
      .send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          to_email: email, // Use the current email state
          subject: `Payment for ${Vehicle_Number}`,
          message: `
          Dear ${cusName},

          Thank you for choosing Mr. Automotive for your vehicle maintenance needs. Your recent payment for Vehicle Number ${Vehicle_Number} is successful. Here's a summary of your payment:

          Payment Summary:
          - Vehicle Number: ${Vehicle_Number}
          - Booking ID: ${Booking_Id}
          - Payment Date: ${PaymentDate}
          - Payment Method: ${PaymentMethod}
          - Total Rs.${Pamount}

          Thanks for your Payment! 

          Best regards,
          Mr. Automotive Team
        `,
        },
        emailConfig.userID
      )
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Email sent successfully!",
          showConfirmButton: true,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error sending email!",
          showConfirmButton: true,
          timer: 2000,
        });
      });
  };

  useEffect(() => {
    const fetchBookingsAndPackages = async () => {
      try {
        const bookingsResponse = await axios.get("http://localhost:3000/api/booking/get/");
        const bookingsData = bookingsResponse.data;
        const customerList = Array.from(new Set(bookingsData.map(booking => booking.cusName)));
        setCustomers(customerList);
        setBookings(bookingsData);

        const packagesResponse = await axios.get("http://localhost:3000/api/maintance/get");
        const packagesData = packagesResponse.data;
        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBookingsAndPackages();
  }, []);

  const handleCustomerChange = (e) => {
    const customerName = e.target.value;
    setSelectedCustomer(customerName);

    const filteredBookings = bookings.filter((booking) => booking.cusName === customerName);
    setCustomerBookings(filteredBookings);

    setBooking_Id("");
    setcusName("");
    setEmail("");
    setVehicle_Number("");
    setPackage("");
    setPamount(0);

    if (filteredBookings.length > 0) {
      const firstBooking = filteredBookings[0];
      setcusName(firstBooking.cusName);
      setEmail(firstBooking.cusEmail); // Ensure email is set correctly
      setVehicle_Number(firstBooking.vehNum);
      setBooking_Id(firstBooking._id);
      setPackage(firstBooking.package ? firstBooking.package.pkgName : "");

      const selectedPackage = packages.find(pkg => pkg.pkgName === (firstBooking.package ? firstBooking.package.pkgName : ""));
      setPamount(selectedPackage ? selectedPackage.pkgPrice : 0);
    }
  };

  const handleBookingChange = (e) => {
    const bookingId = e.target.value;
    const selectedBooking = customerBookings.find((booking) => booking._id === bookingId);

    if (selectedBooking) {
      setcusName(selectedBooking.cusName);
      setEmail(selectedBooking.cusEmail); // Ensure email is updated correctly
      setVehicle_Number(selectedBooking.vehNum);
      setBooking_Id(selectedBooking._id);
      setPackage(selectedBooking.package ? selectedBooking.package.pkgName : "");

      const selectedPackage = packages.find(pkg => pkg.pkgName === (selectedBooking.package ? selectedBooking.package.pkgName : ""));
      setPamount(selectedPackage ? selectedPackage.pkgPrice : 0);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/payments", {
        cusName,
        Vehicle_Number,
        PaymentDate,
        PaymentMethod,
        Booking_Id,
        Package,
        Pamount,
        email,
      });

      Swal.fire({
        title: "Success!",
        text: "Payment added successfully.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Send Email?",
            text: "Do you want to send a confirmation email to the customer?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, send it",
            cancelButtonText: "No, skip",
          }).then((emailResult) => {
            if (emailResult.isConfirmed) {
              sendEmailToCustomer(); // Use updated function to send email
            }
          });
        }
      });

      setcusName("");
      setVehicle_Number("");
      setPaymentDate("");
      setPaymentMethod("");
      setBooking_Id("");
      setPackage("");
      setPamount(0);
      setEmail("");
      setSelectedCustomer("");
      setCustomerBookings([]);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add payment.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4">
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-3xl font-bold mb-6 bg-gray-800 text-white">Add Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-dark block mb-2">Customer</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              required
            >
              <option value="" disabled>Select a customer</option>
              {customers.map((customer) => (
                <option key={customer} value={customer}>
                  {customer}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="mb-4">
            <label className="text-dark block mb-2">Booking ID</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={Booking_Id}
              onChange={handleBookingChange}
              required
            >
              <option value="" disabled>Select a booking</option>
              {customerBookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking._id}
                </option>
              ))}
            </select>
          </div> */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={cusName}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Customer Email</label>
            <input
              type="email"
              className="w-full p-2 border border-dark rounded"
              value={email}
              // readOnly
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Vehicle Number</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={Vehicle_Number}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Payment Date</label>
            <input
              type="date"
              className="w-full p-2 border border-dark rounded"
              value={PaymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              min={today}
              max={maxDateString}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Payment Method</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={PaymentMethod}
              onChange={handlePaymentMethodChange}
              required
            >
              <option value="" disabled>Select a payment method</option>
              {["Credit Card", "Debit Card", "Cash", "Bank Transfer"].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Package</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={Package}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Package Amount (Rs.)</label>
            <input
              type="number"
              className="w-full p-2 border border-dark rounded"
              value={Pamount}
              readOnly
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 border border-dark rounded ${loading ? "bg-gray-500" : "bg-blue-500 text-white"}`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentPage;
