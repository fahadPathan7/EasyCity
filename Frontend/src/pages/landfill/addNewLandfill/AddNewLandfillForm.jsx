import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Space, message } from "antd";
import DarkButton from "../../../components/darkButton/DarkButton";
import backendURL from "../../../lib/backendURL";
import "./AddNewLandfill.css";

const AddNewLandfillForm = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newLandfillInfo, setNewLandfillInfo] = useState({
    landfillID: "",
    name: "",
    operationalTimespan: "",
    capacity:"",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetchLandfillList = async () => {
      try {
        const { data } = await axios.get(
          `${backendURL}/landfill/all-landfills`,
          {
            withCredentials: true,
          }
        );
        const nextLandfillID = data.landfills.length + 1;
        setNewLandfillInfo((prevInfo) => ({
          ...prevInfo,
          landfillID: nextLandfillID.toString(),
        }));
      } catch (error) {
        console.error("Failed to fetch Landfill list:", error);
        message.error("Failed to fetch Landfill list.");
      }
    };

    fetchLandfillList();
  }, []);

  const handleChange = (e) => {
    setNewLandfillInfo({ ...newLandfillInfo, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLandfillInfo.name) message.error("Please fill up Name");
    else if (!newLandfillInfo.operationalTimespan)
      message.error("Please fill up the operational Timespan");
       else if (!newLandfillInfo.capacity)
      message.error("Enter the Capacity");
    else if (!newLandfillInfo.latitude)
      message.error("Enter the latitude of Landfill");
    else if (!newLandfillInfo.longitude)
      message.error("Enter the longitude of Landfill");
    else {
      try {
        const response = await axios.post(
          `${backendURL}/landfill/add-landfill`,
          newLandfillInfo,
          {
            withCredentials: true,
          }
        );
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/landfillList");
        }, 2000);
        console.log(response.data);
        message.success("Landfill added successfully");
      } catch (error) {
        console.error(error);
        message.error("An error occurred.");
      }
      navigate("/landfillList", { state: { uid: 1 } });
    }
  };

  return (
    <div>
      {showSuccess && (
        <div className="success-message">Landfill added successfully</div>
      )}
      <form className="add-new-firm-form" onSubmit={handleSubmit}>
        <div className="addfirm-main-form">
          <div className="addfirm-form-left">
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  Landfill ID&nbsp;
                </label>
                <Input
                  size="large"
                  className="addfirm-form-input"
                  id="landfillID"
                  name="landfillID"
                  value={newLandfillInfo.landfillID}
                  readOnly
                />
              </Space>
            </div>

            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  Name &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="Enter Name"
                  className="addfirm-form-input"
                  id="name"
                  name="name"
                  value={newLandfillInfo.name}
                  onChange={handleChange}
                />
              </Space>
            </div>

             <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addfirm-form-label">
                  Capacity &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="Enter the Capacity"
                  className="addfirm-form-input"
                  id="capacity"
                  name="capacity"
                  value={newLandfillInfo.capacity}
                  onChange={handleChange}
                />
              </Space>
            </div>

            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addfirm-form-label">
                  Operational Timespan &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="Enter Operational Timespan (like 9-6)"
                  className="addfirm-form-input"
                  id="operationalTimespan"
                  name="operationalTimespan"
                  value={newLandfillInfo.operationalTimespan}
                  onChange={handleChange}
                />
              </Space>
            </div>

            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addfirm-form-label">
                  Latitude &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="Enter the Latitude"
                  className="addfirm-form-input"
                  id="latitude"
                  name="latitude"
                  value={newLandfillInfo.latitude}
                  onChange={handleChange}
                />
              </Space>
            </div>
          </div>

          <div className="addfirm-form-right">
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  Enter the Longitude
                </label>
                <Input
                  size="large"
                  placeholder="Enter the Longitude"
                  className="addfirm-form-input"
                  id="longitude"
                  name="longitude"
                  value={newLandfillInfo.longitude}
                  onChange={handleChange}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="registerbtn">
          <DarkButton
            buttonText="Save"
            onClick={() => {
              handleSubmit;
            }}
            routePath="forbidden"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AddNewLandfillForm;
