import React, { useState } from "react";
import { Input, DatePicker, Button, Space, message } from "antd";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DarkButton from "../../../components/darkButton/DarkButton";
const AddInvoiceInfoOfLandfillManagerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    timeOfArrivalLandfill: "",
    timeOfDepartureLandfill: "",
  });

  const handleDateChange1 = (date, dateString) => {
    setFormData({ ...FormData, timeOfArrivalLandfill: date.toISOString() });
  };
  const handleDateChange2 = (date, dateString) => {
    setFormData({ ...FormData, timeOfDepartureLandfill: date.toISOString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const { timeOfArrivalLandfill, timeOfDepartureLandfill } = formData;
      // Perform any additional validation if needed
      const response = await axios.put(
        `http://localhost:3000/vehicle/update-vehicle-landfill/${vehicleNumber}`,
        {
          timeOfArrivalLandfill,
          timeOfDepartureLandfill,
        }
      );
      if (response.status === 200) {
        message.success("Vehicle information updated successfully.");
        navigate("/homepage", {
          state: {},
        });
        // Redirect or perform any additional actions upon successful submission
      } else {
        message.error("Failed to update vehicle information.");
      }
    } catch (error) {
        message.error("An error occurred. Please try again.");
        console.log(error);
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
                  onChange={handleDateChange1}
                  format="YYYY-MM-DD"
                />
              </Space>
            </div>

            {
              //   <div className="addprogram-form-row">
              //     <Space direction="vertical">
              //       <label
              //         htmlFor="programDate"
              //         className="addinvoice-form-label"
              //       >
              //         Program Date:
              //       </label>
              //       <DatePicker
              //         size="large"
              //         onChange={handleDateChange1}
              //         format="YYYY-MM-DD"
              //       />
              //     </Space>
              //   </div>
            }

            <div className="addinvoice-form-row">
              <Space direction="horizontal">
                <label
                  htmlFor="timeOfDepartureLandfill"
                  className="addinvoice-form-label"
                >
                  ট্রাক যাওয়ার সময়ক্ষণ দিন &nbsp;
                </label>

                <DatePicker
                  size="large"
                  className="addinvoice-datepicker"
                  name="timeOfDepartureLandfill"
                  id="timeOfDepartureLandfill"
                  onChange={handleDateChange2}
                  format="YYYY-MM-DD"
                  s
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

export default AddInvoiceInfoOfLandfillManagerForm;
