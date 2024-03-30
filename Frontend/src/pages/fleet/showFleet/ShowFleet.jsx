import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ShowFleet.css"; // Ensure the CSS path is correct
import { LoadingOutlined } from "@ant-design/icons";
import NavBar from "../../../components/navBar/NavBar"; // Ensure the NavBar path is correct

const ShowFleet = () => {
  const location = useLocation();
  const wasteNeedToTransfer = location.state.capacity;
  const [fleetInfo, setFleetInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/fleet/${wasteNeedToTransfer}`)
      .then((response) => {
        if (response.status === 200) {
          setFleetInfo(response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch fleet information:", error);
        message.error("Failed to fetch fleet information.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [wasteNeedToTransfer]);

  // Utility function to safely format numbers
  const safeToFixed = (value, digits = 2) => {
    return value ? value.toFixed(digits) : "0.00";
  };

  return (
    <>
      <NavBar />
      <div className="card-container">
        {loading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          <Row gutter={16}>
            {fleetInfo?.fleet.map((item, index) => (
              <Col span={8} key={index}>
                <Card
                  title={`Vehicle Number: ${item.vehicleNumber}`}
                  bordered={false}
                >
                  <p>STS ID: {item.stsID}</p>
                  <p>Landfill ID: {item.landfillID}</p>
                  <p>Capacity: {item.capacity}</p>
                  <p>Volume of Waste: {item.volumeOfWaste}</p>
                  <p>Trip Distance: {safeToFixed(item.tripDistance)} km</p>
                  <p>Average Cost Per Ton Per Km: ${safeToFixed(item.averageCostPerTonPerKm)}</p>
                  <p>Trip Cost: ${safeToFixed(item.tripCost)}</p>
                  <p>Trip Count: {item.tripCount}</p>
                </Card>
              </Col>
            ))}
            {fleetInfo && (
              <Col span={24}>
                <Card bordered={false}>
                  <p>Total Cost: ${safeToFixed(fleetInfo.totalCost)}</p>
                  <p>Total Distance: {safeToFixed(fleetInfo.totalDistance)} km</p>
                  <p>Total Trips: {fleetInfo.totalTrips}</p>
                  <p>Total Waste Transferred: {fleetInfo.totalWasteTransfered}</p>
                  <p>Remaining Waste: {fleetInfo.remainingWaste}</p>
                  <p>Total Number of Vehicles: {fleetInfo.totalNumberOfVehicles}</p>
                </Card>
              </Col>
            )}
          </Row>
        )}
      </div>
    </>
  );
};

export default ShowFleet;
