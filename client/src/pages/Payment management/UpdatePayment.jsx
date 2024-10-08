import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const UpdatePayment = ({ isOpen, onClose, paymentData, onUpdate }) => {
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
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  useEffect(() => {
    if (paymentData) {
      setcusName(paymentData.cusName || "");
      setVehicle_Number(paymentData.Vehicle_Number || "");
      setPaymentDate(paymentData.PaymentDate || "");
      setPaymentMethod(paymentData.PaymentMethod || "");
      setBooking_Id(paymentData.Booking_Id || "");
      setPackage(paymentData.Package || "");
      setPamount(paymentData.Pamount || 0);
      setEmail(paymentData.email || "");
      setCurrentId(paymentData._id || "");
      setSelectedCustomer(paymentData.cusName || "");
      
      const filteredBookings = bookings.filter((booking) => booking.cusName === paymentData.cusName);
      setCustomerBookings(filteredBookings);
    }
  }, [paymentData, bookings]);

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
      setEmail(firstBooking.cusEmail);
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
      setEmail(selectedBooking.cusEmail);
      setVehicle_Number(selectedBooking.vehNum);
      setBooking_Id(selectedBooking._id);
      setPackage(selectedBooking.package ? selectedBooking.package.pkgName : "");

      const selectedPackage = packages.find(pkg => pkg.pkgName === (selectedBooking.package ? selectedBooking.package.pkgName : ""));
      setPamount(selectedPackage ? selectedPackage.pkgPrice : 0);
    }
  };

  const handlePackageChange = (e) => {
    const selectedPackage = packages.find(pkg => pkg.pkgName === e.target.value);
    setPackage(e.target.value);
    setPamount(selectedPackage ? selectedPackage.pkgPrice : 0);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(`http://localhost:3000/payments/${currentId}`, {
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
        text: "Payment updated successfully.",
        icon: "success",
      });

      onUpdate(data);
      onClose();
    } catch (error) {
      console.error("Error updating payment:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update payment.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-dark text-2xl font-bold mb-6">Update Payment</h2>
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
            <div className="mb-4">
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
            </div>
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
                readOnly
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
                {["Credit Card", "Debit Card", "Cash", "Bank Transfer"].map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-dark block mb-2">Package</label>
              <select
                className="w-full p-2 border border-dark rounded"
                value={Package}
                onChange={handlePackageChange}
              >
                <option value="" disabled>Select a package</option>
                {packages.map(pkg => (
                  <option key={pkg.pkgID} value={pkg.pkgName}>{pkg.pkgName}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-dark block mb-2">Payment Amount</label>
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
              {loading ? "Updating..." : "Update Payment"}
            </button>
            <button
              type="button"
              className="mt-4 w-full p-2 border border-dark rounded bg-red-500 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdatePayment;
