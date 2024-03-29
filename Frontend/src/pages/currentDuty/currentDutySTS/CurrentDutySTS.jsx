import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../../components/navBar/NavBar";
import "./CurrentDutySTS.css"; // Make sure to import CSS file for styling
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import backendURL from "../../../lib/backendURL";

export default function CurrentDutySTS() {
  const navigate = useNavigate();

  const [stsInfo, setStsInfo] = useState(null);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/sts/check-manager`
        );
        console.log(res.data);
        setStsInfo(res.data.sts);
      } catch (error) {
        console.log(error);
      }
      setSpinning(false);
    };
    fetchData();
  }, []);

  function displayStsInfo() {
    if (stsInfo) {
      return (
        <div className="sts-info">
          <p>STS ID: {stsInfo.stsID}</p>
          <p>Ward Number: {stsInfo.wardNumber}</p>
          <p>Capacity: {stsInfo.capacity}</p>
          <p>Volume of Waste: {stsInfo.volumeOfWaste}</p>
          <p>Latitude: {stsInfo.latitude}</p>
          <p>Longitude: {stsInfo.longitude}</p>
          <p>STS Managers: {stsInfo.stsManagers.join(", ")}</p>
          <p>Vehicle Numbers: {stsInfo.vehicleNumbers.join(", ")}</p>
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <NavBar />
      <div className="current-duty-sts-page">
        <div className="sts-title-section">
          <div className="main-title-sts">Current Duty STS</div>
        </div>
        <div className="sts-info-container">
          {spinning === true ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 150,
                    color: "black",
                  }}
                  spin
                />
              }
            />
          ) : stsInfo ? (
            displayStsInfo()
          ) : (
            <div>Error fetching STS info</div>
          )}
        </div>
      </div>
    </>
  );
}
