import React, { useState } from "react";
import { Input, DatePicker, Button, Space, message } from "antd";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DarkButton from "../../../components/darkButton/DarkButton";
const AddInvoiceInfoOfLandfillManagerForm = () => {
  const { vehicleNumber } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    timeOfArrivalLandfill: "",
    timeOfDepartureLandfill: "",
  });

  const handleDateChange1 = (date, dateString) => {
    setFormData({ ...formData, timeOfArrivalLandfill: date.toISOString() });
  };
  const handleDateChange2 = (date, dateString) => {
    setFormData({ ...formData, timeOfDepartureLandfill: date.toISOString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.timeOfArrivalLandfill)
      message.error("Please fill up timeOfArrivalSts");
    else if (!formData.timeOfDepartureLandfill)
      message.error("Please fill up the amount of timeOfDepartureSts");

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
        const { billID } = response.data;
        message.success(message);
        navigate("/billDownloadPage", {
          state: {
            billID: billID, // Pass generated bill ID to the next page
          },
        });
        // Redirect or perform any additional actions upon successful submission
      } else {
        message.error("Vehicle is still in STS");
      }
    } catch (error) {
      message.error("Vehicle is still in STS");
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
                  name="timeOfArrivalLandfill"
                  id="timeOfArrivalLandfill"
                  onChange={handleDateChange1}
                  format="YYYY-MM-DD"
                />
              </Space>
            </div>

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
