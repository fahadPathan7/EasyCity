import React, { useEffect, useState } from "react";
import { Row, Col, Card } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../../components/navBar/NavBar"; // Adjust path as necessary
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./CurrentDutyLandfill.css"; // Make sure to import CSS file for styling
import backendURL from "../../../lib/backendURL";

export default function CurrentDutyLandfill() {
  const navigate = useNavigate();

  const [landfillInfo, setLandfillInfo] = useState(null);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendURL}/landfill/check-manager`);
        console.log(res.data);
        setLandfillInfo(res.data.landfill);
      } catch (error) {
        console.log(error);
      }
      setSpinning(false);
    };
    fetchData();
  }, []);

  function displayLandfillInfo() {
    if (landfillInfo) {
      return (
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Landfill ID" bordered={false}>
              {landfillInfo.landfillID}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Name" bordered={false}>
              {landfillInfo.name}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Volume of Waste" bordered={false}>
              {landfillInfo.volumeOfWaste}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Operational Timespan" bordered={false}>
              {landfillInfo.operationalTimespan}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Latitude" bordered={false}>
              {landfillInfo.latitude}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Longitude" bordered={false}>
              {landfillInfo.longitude}
            </Card>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <NavBar />
      <div className="current-duty-landfill-page">
        <div className="landfill-title-section">
          <div className="main-title-landfill">Current Duty Landfill</div>
        </div>
        <div className="landfill-info-container">
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
          ) : landfillInfo ? (
            displayLandfillInfo()
          ) : (
            <div>Error fetching landfill info</div>
          )}
        </div>
      </div>
    </>
  );
}
