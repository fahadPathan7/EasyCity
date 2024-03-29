import React, { useState, useEffect } from "react";
import { Input, DatePicker, Space, Select, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DarkButton from "../../../components/darkButton/DarkButton";
import "./AddNewProgram.css";

axios.defaults.withCredentials = true; // Ensure axios sends cookies with requests


export default function AddNewProgramForm() {
  const navigate = useNavigate();

  const [newProgramInfo, setNewProgramInfo] = useState({
    vehicleNumber: "",
    stsID: "",
    landfillID: "",
  });
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [stsOptions, setStsOptions] = useState([]);
  const [landfillOptions, setLandfillOptions] = useState([]);

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

        // Fetch landfill options
        const landfillResponse = await axios.get(
          "http://localhost:3000/landfill/all-landfills"
        );
        setLandfillOptions(
          landfillResponse.data.landfills.map((option) => ({
            value: option.landfillID,
            label: option.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you could add more validation before sending the data
    if (!newProgramInfo.stsID || !newProgramInfo.vehicleNumber.length) {
      message.error("Please fill all the required fields.");
      console.log(newProgramInfo);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/vehicle/assign-vehicle",
        {
          stsID: newProgramInfo.stsID,
          vehicleNumber: newProgramInfo.vehicleNumber,
          landfillID: newProgramInfo.landfillID,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
        console.log("Vehicle added to STS successfully.");
        // Redirect or handle the successful submission
        navigate("/homepage", { state: { newProgramInfo } });
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
            {/* Select Vehicle Number */}
            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label
                  htmlFor="vehicleNumber"
                  className="addprogram-form-label"
                >
                  Select Vehicle Number:
                </label>
                <Select
                  size="large"
                  placeholder="Select Vehicle Number"
                  className="addprogram-form-input"
                  onChange={(value) =>
                    setNewProgramInfo({
                      ...newProgramInfo,
                      vehicleNumber: value,
                    })
                  }
                  options={vehicleOptions}
                />
              </Space>
            </div>

            {/* Select Landfill */}
            <div className="addprogram-form-row">
              <Space direction="horizontal">
                <label htmlFor="landfillID" className="addprogram-form-label">
                  Select Landfill:
                </label>
                <Select
                  size="large"
                  placeholder="Select Landfill"
                  className="addprogram-form-input"
                  onChange={(value) =>
                    setNewProgramInfo({ ...newProgramInfo, landfillID: value })
                  }
                  options={landfillOptions}
                />
              </Space>
            </div>

            {/* Select STS */}
            <div className="addprogram-form-row">
              <Space direction="horizontal">
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
        </div>

        <div className="addprogram-submit-button">
          <DarkButton buttonText="Save" type="button" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}
