import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Car from "../../assets/carbg2.png";
import axios from "axios";
import Swal from "sweetalert2";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import Switch from "@mui/material/Switch";
import { useParams, useNavigate } from "react-router-dom";

const CreateBooking = () => {
  const navigate = useNavigate();
  const cusEmail = localStorage.getItem("email");
  const cusName = localStorage.getItem("name");
  const [disabledDates, setDisabledDates] = useState([]);
  const [maintancePkg, setMaintancePkg] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(dayjs("2022-04-17T15:30")); // Set default time to 8 AM
  const [formErrors, setFormErrors] = useState({});
  const [checked, setChecked] = React.useState(false);
  const [bookingData, setBookingData] = useState({
    package: {
      pkgName: "",
      pkgID: "",
      pkgDes: "",
      pkgPrice: 0,
    },
    cusMobile: "",
    vType: "",
    vehNum: "",
    milage: 0,
    date: "",
    time: "",
    note: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchMaintaincePkgs = async () => {
      try {
        const pkgs = await axios.get(
          `http://localhost:3000/api/maintance/get/${id}`
        );
        const bookings = await axios.get(
          "http://localhost:3000/api/booking/get"
        );

        setMaintancePkg(pkgs.data);

        // Create a map that stores the count of bookings for each date
        const bookedDates = bookings.data.reduce((acc, bk) => {
          const date = dayjs(bk.date).format("YYYY-MM-DD");
          acc[date] = acc[date] ? acc[date] + 1 : 1;
          return acc;
        }, {});

        setDisabledDates(bookedDates); // Store the map
      } catch (error) {
        console.error("Error fetching repair estimates:", error);
      }
    };
    fetchMaintaincePkgs();
  }, [id]);

  // Validation Functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateVehicleNumber = (vehNum) => {
    const vehRegex = /^(?:[A-Z]{3}-\d{4}|[A-Z]{2}-\d{4})$/;
    return vehRegex.test(vehNum);
  };

  const validateMileage = (milage) => {
    return milage > 0;
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
    let errors = { ...formErrors };
    if (name === "cusMobile" && !validatePhoneNumber(value)) {
      errors.cusMobile = "Phone number must be 10 digits long";
    } else {
      errors.cusMobile = "";
    }

    if (name === "vehNum" && !validateVehicleNumber(value)) {
      errors.vehNum = "Invalid vehicle number format";
    } else {
      errors.vehNum = "";
    }

    if (name === "milage" && !validateMileage(value)) {
      errors.milage = "Mileage must be a positive number";
    } else {
      errors.milage = "";
    }

    setFormErrors(errors);
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any validation errors
    if (Object.values(formErrors).some((error) => error !== "")) {
      Swal.fire({
        title: "Error!",
        text: "Please fix the validation errors before submitting.",
        icon: "error",
      });
      return;
    }

    try {
      const updatedBookingData = {
        ...bookingData,
        cusName: cusName,
        cusEmail: cusEmail,
        package: maintancePkg,
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
        time: selectedTime ? selectedTime.format("HH:mm") : "",
      };

      const response = await axios.post(
        "http://localhost:3000/api/booking/add",
        updatedBookingData
      );
      console.log(updatedBookingData);

      Swal.fire({
        title: "Success!",
        text: "Booking Successfully Created.",
        icon: "success",
      });
      navigate("/bookings");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to create booking. Please try again.",
        icon: "error",
      });
      navigate("/Booking");
    }
  };

  const handleChangee = (event) => {
    setChecked(event.target.checked);

    if (checked) {
      bookingData.vehNum = "";
    } else {
      bookingData.vehNum = "ශ්‍රී - ";
    }
  };

  const shouldDisableDate = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    return disabledDates[formattedDate] >= 4; // Disable the date if it has 4 or more bookings
  };

  const minTime = dayjs().hour(8).minute(0);

  const maxTime = dayjs().hour(18).minute(0);
  return (
    <div>
      <NavBar />
      <div className="flex w-screen items-center">
        <div className="mt-28 ml-5 flex flex-col w-1/3">
          <img src={Car} alt="" className="" style={{ width: "800px" }} />
        </div>

        <div className="pt-28 pr-10 flex flex-col w-2/3">
          <div className="ml-20 mb-10 flex justify-end">
            <div
              className="bg-lime-300 rounded-2xl shadow-md overflow-hidden flex h-40"
              style={{ width: "750px" }}
            >
              <img src={maintancePkg.imageURL} className="h-48 object-cover" />
              <div className="p-3">
                <h4 className="text-xl font-semibold mb-2">
                  {maintancePkg.pkgName}
                </h4>
                <p className=" " style={{ fontSize: "13px" }}>
                  {maintancePkg.pkgDes}
                </p>
                <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg mr-5 mt-2">
                  Rs.{maintancePkg.pkgPrice}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <form onSubmit={handleSubmit} className="w-5/6 rigth-0">
              <div className=" bg-slate-200 p-4 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-5">
                  General Information
                </h2>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col w-2/4">
                    <label className="block text-gray-700 required">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="cusName"
                      className="border border-gray-300 rounded-md p-2 mr-5"
                      value={cusName}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-2/4">
                    <label className="block text-gray-700 required">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="cusEmail"
                      className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-5"
                      value={cusEmail}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col w-1/4 mr-5">
                    <label className="block text-gray-700 required">
                      Phone:
                    </label>
                    <input
                      type="text"
                      name="cusMobile"
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      value={bookingData.cusMobile}
                      onChange={(e) => {
                        // Allow only numbers
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, "");
                        handleBookingChange({ target: { name: "cusMobile", value: numbersOnly } });
                      }}
                      required
                    />
                    {formErrors.cusMobile && (
                      <span className="text-red-500 text-sm">
                        {formErrors.cusMobile}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col w-1/6 mr-5">
                    <label className="block text-gray-700 required">
                      Vehicle Type:
                    </label>
                    <input
                      type="text"
                      name="vType"
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      value={bookingData.vType}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters (uppercase and lowercase)
                        if (/^[A-Za-z]*$/.test(value)) {
                          handleBookingChange(e);
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="flex flex-col w-1/4">
                    {/*<div className="flex">
                      <label>SRI Format: </label>
                      <Switch
                        checked={checked}
                        onChange={handleChangee}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>*/}
                    <label className="block text-gray-700 required">
                      Vehicle No:
                    </label>
                    <input
                      type="text"
                      name="vehNum"
                      className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                      value={bookingData.vehNum}
                      onChange={handleBookingChange}
                      required
                    />

                    {checked
                      ? !/ශ්‍රී - \d{4}$/.test(bookingData.vehNum) &&
                      bookingData.vehNum && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid vehicle number (ශ්‍රී - 4444)
                        </p>
                      )
                      : !/^(?:[A-Z]{3}-\d{4}|[A-Z]{2}-\d{4})$/.test(
                        bookingData.vehNum
                      ) &&
                      bookingData.vehNum && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid vehicle number
                        </p>
                      )}
                  </div>
                  <div className="flex flex-col w-1/6">
                    <label className="block text-gray-700 required">
                      Mileage:
                    </label>
                    <input
                      type="number"
                      name="milage"
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      value={bookingData.milage}
                      onChange={(e) => {
                        // Allow only positive integers
                        const value = e.target.value;
                        // Check if the value is a positive integer
                        if (value === "" || /^[0-9]*$/.test(value)) {
                          handleBookingChange({ target: { name: "milage", value } });
                        }
                      }}
                      min="0" // Set minimum value to 0
                      step="1" // Prevent decimal values
                      required
                    />
                    {formErrors.milage && (
                      <span className="text-red-500 text-sm">
                        {formErrors.milage}
                      </span>
                    )}
                  </div>

                </div>

                <div className="flex flex-col w-full">
                  <label className="block text-gray-700">Special Notes:</label>
                  <textarea
                    name="note"
                    className="border border-gray-300 rounded-md p-2 bg-gray-100"
                    value={bookingData.note}
                    onChange={handleBookingChange}
                  />
                </div>
              </div>

              <div className=" bg-slate-200 p-4 rounded-2xl shadow-sm mt-5">
                <h2 className="text-2xl font-bold mb-5">
                  Time and Date Selection
                </h2>
                <div className="flex gap-5">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Pick a date and time"
                      disablePast
                      value={selectedDate}
                      onChange={setSelectedDate}
                      shouldDisableDate={shouldDisableDate}
                      renderInput={(params) => (
                        <TextField {...params} className="w-full" />
                      )}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div>
                      {/* Display selected time */}
                      <DesktopTimePicker
                        value={selectedTime}
                        onChange={(newValue) => setSelectedTime(newValue)}
                        minutesStep={1}
                        ampm={false}
                        minTime={minTime}
                        maxTime={maxTime}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                  </LocalizationProvider>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  className="bg-yellow-400 text-black font-bold py-2 px-10 rounded-lg mb-20"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateBooking;
