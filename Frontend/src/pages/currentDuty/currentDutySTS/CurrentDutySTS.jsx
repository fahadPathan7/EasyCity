import React, { useEffect, useState } from "react";
import { Row, Col, Card } from 'antd';
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
        <Row gutter={16}>
          <Col span={8}>
            <Card title="STS ID" bordered={false}>
              {stsInfo.stsID}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Ward Number" bordered={false}>
              {stsInfo.wardNumber}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Capacity" bordered={false}>
              {stsInfo.capacity}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Volume of Waste" bordered={false}>
              {stsInfo.volumeOfWaste}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Latitude" bordered={false}>
              {stsInfo.latitude}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Longitude" bordered={false}>
              {stsInfo.longitude}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="STS Managers" bordered={false}>
              {stsInfo.stsManagers.join(", ")}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Vehicle Numbers" bordered={false}>
              {stsInfo.vehicleNumbers.join(", ")}
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
