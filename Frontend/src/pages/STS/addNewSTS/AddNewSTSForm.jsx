import DarkButton from "../../../components/darkButton/DarkButton";
import backendURL from "../../../lib/backendURL";

import { Input, InputNumber, Space, message } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import "./AddNewSTS.css";

export default function AddNewSTSForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newSTSInfo, setNewSTSInfo] = useState({
    stsID: "",
    wardNumber: "",
    capacity: "",
    latitude: "",
    longitude: "",
  });
  useEffect(() => {
    const fetchSTSList = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/sts/all-sts`, {
          withCredentials: true,
        });
        // Assuming the STS IDs are sequential and numeric
        const nextSTSId = data.sts.length + 1;
        setNewSTSInfo((prevInfo) => ({
          ...prevInfo,
          stsID: nextSTSId.toString(), // Convert to string if your ID is expected as a string
        }));
      } catch (error) {
        console.error("Failed to fetch STS list:", error);
        message.error("Failed to fetch STS list.");
      }
    };

    fetchSTSList();
  }, []);

  const handleChange = (e) => {
    if (
      (e.target.name === "stsID" ||
        e.target.name === "wardNumber" ||
        e.target.name === "capacity") &&
      !(
        typeof Number(e.target.value) === "number" &&
        !Number.isNaN(Number(e.target.value))
      )
    )
      return;
    setNewSTSInfo({ ...newSTSInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    e.preventDefault();
    if (!newSTSInfo.wardNumber) message.error("Please fill up WardNumber");
    else if (!newSTSInfo.capacity)
      message.error("Please fill up the amount of capacity");
    else if (!newSTSInfo.latitude) message.error("Enter the latitude of STS");
    else if (!newSTSInfo.longitude) message.error("Enter the longitude of STS");
    else {
      //message.error(JSON.stringify(firmInfoFinal));
      try {
        const response = await axios.post(
          backendURL + "/sts/add-sts",
          newSTSInfo,
          {
            // headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }
        );
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/STSList");
        }, 2000);
        console.log(response.data);
        message.success("STS added successfully");
      } catch (error) {
        console.log(error);
        message.error(error);
      }
      navigate("/STSList", {
        state: {
          uid: 1,
        },
      });
    }
  };

  return (
    <div>
      {showSuccess && (
        <div className="success-message">STS added successfully</div>
      )}
      <form className="add-new-firm-form" onSubmit={handleSubmit}>
        <div className="addfirm-main-form">
          <div className="addfirm-form-left">
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  STS ID&nbsp;
                </label>
                <Input
                  size="large"
                  className="addfirm-form-input"
                  id="stsID"
                  name="stsID"
                  value={newSTSInfo.stsID}
                  readOnly
                />
              </Space>
            </div>

            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  Ward number &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="Enter Ward number"
                  className="addfirm-form-input"
                  id="wardNumber"
                  name="wardNumber"
                  value={newSTSInfo.wardNumber}
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
                  placeholder="Enter Capacity"
                  className="addfirm-form-input"
                  id="capacity"
                  name="capacity"
                  value={newSTSInfo.capacity}
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
                  value={newSTSInfo.latitude}
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
                  value={newSTSInfo.longitude}
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
}
