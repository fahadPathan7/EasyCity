import React, { useState, useEffect } from "react";
import { Input, DatePicker, Space, Select, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DarkButton from "../../../components/darkButton/DarkButton";
import "./AddNewProgram.css";

axios.defaults.withCredentials = true; // Ensure axios sends cookies with requests

// Function to generate a random six-character string
const generateRandomProgramID = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function AddNewProgramForm() {
  const navigate = useNavigate();

  const [newProgramInfo, setNewProgramInfo] = useState({
    programNo: generateRandomProgramID(), // Generate random program ID
    programDate: "",
    assignedVehicleNumber: [],
    stsID: "",
    assignedSTSManagerID: "",
    assignedLandfillManagerID: "",
  });
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [stsOptions, setStsOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);

  // Fetch STS options and manager options
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch STS options
        const stsResponse = await axios.get(
          "http://localhost:3000/sts/all-sts"
        );
        setStsOptions(
          stsResponse.data.sts.map((option) => ({
            value: option.stsID,
            label: option.wardNumber.toString(),
          }))
        );

        // Fetch unassigned vehicle options
        const vehicleResponse = await axios.get(
          "http://localhost:3000/vehicle/unassigned-vehicles"
        );
        setVehicleOptions(
          vehicleResponse.data.vehicles.map((vehicle) => ({
            value: vehicle.vehicleNumber,
            label: `${vehicle.vehicleNumber} - ${vehicle.type}`,
          }))
        );

        // Fetch manager options
        const managerResponse = await axios.get(
          "http://localhost:3000/sts/unassigned-managers"
        );
        setManagerOptions(
          managerResponse.data.unassignedStsManagers.map((option) => ({
            value: option.userID,
            label: option.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewProgramInfo({ ...newProgramInfo, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, dateString) => {
    setNewProgramInfo({ ...newProgramInfo, programDate: dateString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you could add more validation before sending the data
    if (!newProgramInfo.stsID || !newProgramInfo.assignedVehicleNumber.length) {
      message.error("Please fill all the required fields.");
      console.log(newProgramInfo);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/sts/add-vehicles-sts",
        {
          stsID: newProgramInfo.stsID,
          vehicleNumbers: newProgramInfo.assignedVehicleNumber,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
        console.log("Vehicle added to STS successfully.");
        // Redirect or handle the successful submission
        navigate("/addInvoiceInfoOfSTSManager", { state: { newProgramInfo } });
      } else {
        message.error("An error occurred during submission.");
      }
    } catch (error) {
      message.error("Submission failed.");
    }
  };

  return (
    <div className="add-new-program">
      <form className="add-new-program-form" onSubmit={handleSubmit}>
        <div className="addprogram-main-form">
          {/* Left Section */}
          <div className="addprogram-form-left">
            {/* Program Number */}
            <div className="addprogram-form-row">
              <Space direction="vertical">
                <label htmlFor="programNo" className="addprogram-form-label">
                  Program Number:
                </label>
                <Input
                  size="large"
                  placeholder="Enter program number"
                  name="programNo"
                  value={newProgramInfo.programNo}
                  onChange={handleChange}
                />
              </Space>
            </div>

            {/* Program Date */}
            <div className="addprogram-form-row">
              <Space direction="vertical">
                <label htmlFor="programDate" className="addprogram-form-label">
                  Program Date:
                </label>
                <DatePicker
                  size="large"
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                />
              </Space>
            </div>

            {/* Select STS */}
            <div className="addprogram-form-row">
              <Space direction="vertical">
                <label htmlFor="stsID" className="addprogram-form-label">
                  Select STS:
                </label>
                <Select
                  size="large"
                  placeholder="Select STS"
                  className="addprogram-form-input"
                  onChange={(value) =>
                    setNewProgramInfo({ ...newProgramInfo, stsID: value })
                  }
                  options={stsOptions}
                />
              </Space>
            </div>
          </div>

          {/* Right Section */}
          <div className="addprogram-form-right">
            {/* Assigned STS Manager */}
            <div className="addprogram-form-row">
              <Space direction="vertical">
                <label
                  htmlFor="assignedSTSManagerID"
                  className="addprogram-form-label"
                >
                  Assign STS Manager:
                </label>
                <Select
                  size="large"
                  placeholder="Select STS Manager"
                  className="addprogram-form-input"
                  onChange={(value) =>
                    setNewProgramInfo({
                      ...newProgramInfo,
                      assignedSTSManagerID: value,
                    })
                  }
                  options={managerOptions}
                />
              </Space>
            </div>

            {/* Assigned Landfill Manager */}
            <div className="addprogram-form-row">
              <Space direction="vertical">
                <label
                  htmlFor="assignedLandfillManagerID"
                  className="addprogram-form-label"
                >
                  Assign Landfill Manager:
                </label>
                <Select
                  size="large"
                  placeholder="Select Landfill Manager"
                  className="addprogram-form-input"
                  onChange={(value) =>
                    setNewProgramInfo({
                      ...newProgramInfo,
                      assignedLandfillManagerID: value,
                    })
                  }
                  options={managerOptions}
                />
              </Space>
            </div>

            {/* Assigned Vehicles */}
            <div className="addprogram-form-row">
              <Space direction="vertical">
                <label
                  htmlFor="assignedVehicleNumber"
                  className="addprogram-form-label"
                >
                  Assigned Vehicles:
                </label>
                <Select
                  size="large"
                  mode="multiple"
                  placeholder="Select assigned vehicles"
                  className="addprogram-form-input"
                  onChange={(values) =>
                    setNewProgramInfo({
                      ...newProgramInfo,
                      assignedVehicleNumber: values,
                    })
                  }
                >
                  {/* Populate options based on available vehicles */}
                  {vehicleOptions.map((vehicle) => (
                    <Select.Option key={vehicle.value} value={vehicle.value}>
                      {vehicle.label}
                    </Select.Option>
                  ))}
                </Select>
              </Space>
            </div>
          </div>
        </div>

        <div className="addprogram-submit-button">
          <DarkButton buttonText="Save" type="button" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}
