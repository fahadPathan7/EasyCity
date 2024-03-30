import DarkButton from "../../../components/darkButton/DarkButton";
import backendURL from "../../../lib/backendURL";

import { Input, InputNumber, Space, message } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import "./IntroFleet.css";

export default function AddNewSTSForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newSTSInfo, setNewSTSInfo] = useState({
    capacity: "",
  });

  const handleChange = (e) => {
    if (
      e.target.name === "capacity" &&
      !(
        typeof Number(e.target.value) === "number" &&
        !Number.isNaN(Number(e.target.value))
      )
    )
      return;
    setNewSTSInfo({ ...newSTSInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!newSTSInfo.capacity) {
    message.error("ময়লার পরিমাণ লিখুন ");
  } else {
    try {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/showFleet", {
          state: {
            capacity: newSTSInfo.capacity
          }
        });
      }, 500);
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  }
};


  return (
    <div>
      
      <form className="add-new-firm-form" onSubmit={handleSubmit}>
        <div className="addfirm-main-form">
          <div className="addfirm-form-left">
            <div className="addfirm-form-row">
              <Space direction="hotizontal">
                <label htmlFor="password" className="addfirm-form-label">
                  ময়লার পরিমাণ লিখুন &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="ময়লার পরিমাণ লিখুন"
                  className="addfirm-form-input"
                  id="capacity"
                  name="capacity"
                  value={newSTSInfo.capacity}
                  onChange={handleChange}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="registerbtn">
          <DarkButton
            buttonText="Done"
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
