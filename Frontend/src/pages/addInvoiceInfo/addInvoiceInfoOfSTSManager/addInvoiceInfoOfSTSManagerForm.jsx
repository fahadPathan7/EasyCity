import React, { useState } from "react";
import { Input, DatePicker, Button, message, Space, Select } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DarkButton from "../../../components/darkButton/DarkButton";
const AddInvoiceInfoOfSTSManagerForm = () => {
  const navigate = useNavigate();
  const { vehicleNumber, capacity } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    timeOfArrivalSts: "",
    timeOfDepartureSts: "",
    volumeOfWaste: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange1 = (date, dateString) => {
    const formattedDate = dateString.split("/").reverse().join("-"); // Convert to YYYY-MM-DD format
    setFormData({ ...formData, timeOfArrivalSts: formattedDate });
  };

  const handleDateChange2 = (date, dateString) => {
    const formattedDate = dateString.split("/").reverse().join("-"); // Convert to YYYY-MM-DD format
    setFormData({ ...formData, timeOfDepartureSts: formattedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste } = formData;
      // Perform any additional validation if needed
      console.log(formData);
      if (!formData.timeOfArrivalSts)
        message.error("Please fill up timeOfArrivalSts");
      else if (!formData.timeOfDepartureSts)
        message.error("Please fill up the amount of timeOfDepartureSts");
      else if (!formData.volumeOfWaste) message.error("volumeOfWaste");
      else if (formData.volumeOfWaste > capacity) {
        message.error("This exceeds truck capacity!");
      } else {
        const response = await axios.put(
          `http://localhost:3000/vehicle/update-vehicle-sts/${vehicleNumber}`,
          {
            timeOfArrivalSts,
            timeOfDepartureSts,
            volumeOfWaste,
          },
          {
            withCredentials: true, // Add this line to include withCredentials
          }
        );
        if (response.status === 200) {
          message.success("Invoice information updated successfully.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate("/homepage");
          }, 1000);
          // Redirect or perform any additional actions upon successful submission
        } else {
          message.error("Failed to update invoice information.");
        }
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <form className="add-new-program-form" onSubmit={handleSubmit}>
        <div className="addinvoice-main-form">
          <div className="addinvoice-form-left">
            <div className="addinvoice-form-row">
              <Space direction="horizontal">
                <label
                  htmlFor="timeOfArrivalLandfill"
                  className="addinvoice-form-label"
                >
                  ট্রাক আসার সময়ক্ষণ দিন
                </label>
                <DatePicker
                  size="large"
                  className="addinvoice-datepicker"
                  name="timeOfArrivalSts" // Match with the name in handleChange function
                  id="timeOfArrivalSts"
                  onChange={handleDateChange1}
                  format="YYYY-MM-DD"
                />
              </Space>
            </div>

            <div className="addinvoice-form-row">
              <Space direction="horizontal">
                <label
                  htmlFor="timeOfDepartureSts"
                  className="addinvoice-form-label"
                >
                  ট্রাক যাওয়ার সময়ক্ষণ দিন &nbsp;
                </label>

                <DatePicker
                  size="large"
                  className="addinvoice-datepicker"
                  name="timeOfDepartureSts" // Match with the name in handleChange function
                  id="timeOfDepartureSts"
                  onChange={handleDateChange2}
                  format="YYYY-MM-DD"
                />
              </Space>
            </div>

            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label className="addfirm-form-label">
                  ময়লার পরিমাণ দিন &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="ময়লার পরিমাণ দিন"
                  className="addfirm-form-input"
                  id="volumeOfWaste"
                  name="volumeOfWaste"
                  value={formData.volumeOfWaste}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  addonAfter="টন"
                />
              </Space>
            </div>
          </div>
        </div>

        <div className="registerbtn">
          <DarkButton
            buttonText="সংরক্ষন করুন"
            onClick={handleSubmit}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AddInvoiceInfoOfSTSManagerForm;
