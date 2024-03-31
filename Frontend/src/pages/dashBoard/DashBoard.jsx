import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, Spin, message } from "antd";
import NavBar from "../../components/navBar/NavBar";
import { LoadingOutlined } from "@ant-design/icons";
import backendURL from "../../lib/backendURL";
import BackButton from "../../components/backButton/BackButton";
import  "./Dashboard.css"
const RunningProgramsPage = () => {
  const [spinning, setSpinning] = useState(true);
  const [vehiclesToLandfill, setVehiclesToLandfill] = useState([]);
  const [vehiclesToSts, setVehiclesToSts] = useState([]);
  const [dailyTrips, setDailyTrips] = useState({});
  const [totalVolume, setTotalVolume] = useState({});
  const [stsWasteTransferred, setStsWasteTransferred] = useState([]);
  const [landfillStatus, setLandfillStatus] = useState([]);
  const [dailyCost, setDailyCost] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicles to landfill
        const resLandfill = await axios.get(
          `${backendURL}/dashboard/vehicles-to-landfill`,
          { withCredentials: true }
        );
        setVehiclesToLandfill(resLandfill.data.vehiclesToLandfill);

        // Fetch vehicles to STS
        const resSts = await axios.get(
          `${backendURL}/dashboard/vehicles-to-sts`,
          { withCredentials: true }
        );
        setVehiclesToSts(resSts.data.vehiclesToSts);

        // Fetch daily trips
        const resDailyTrips = await axios.get(
          `${backendURL}/dashboard/daily-trip-count-seven-days`,
          { withCredentials: true }
        );
        setDailyTrips(resDailyTrips.data.dailyTrips);

        // Fetch total volume of waste transferred
        const resTotalVolume = await axios.get(
          `${backendURL}/dashboard/total-volume-of-waste-transferred-seven-days`,
          { withCredentials: true }
        );
        setTotalVolume(resTotalVolume.data.totalVolume);
        // Fetch volume of waste transferred by STS today
        const resWasteTransferredToday = await axios.get(
          `${backendURL}/dashboard/volume-of-waste-transferred-by-sts-today`,
          { withCredentials: true }
        );
        setStsWasteTransferred(
          resWasteTransferredToday.data.stsWasteTransferred
        );

        // Fetch current volume of waste at each landfill
        const resLandfillStatus = await axios.get(
          `${backendURL}/dashboard/volume-of-waste-at-landfills`,
          { withCredentials: true }
        );
        setLandfillStatus(resLandfillStatus.data.landfillStatus);

        // Fetch daily fuel cost for the last seven days
        const resDailyCost = await axios.get(
          `${backendURL}/dashboard/daily-cost-seven-days`,
          { withCredentials: true }
        );
        setDailyCost(resDailyCost.data.dailyCost);
      } catch (error) {
        message.error(error.response?.data?.msg || "An error occurred");
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div style={{ padding: "20px" }}>
        {/* Daily Trip Count for the Last 7 Days */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            title="Daily Trip Count for the Last 7 Days"
            bordered={false}
            style={{ width: 600 }}
          >
            {Object.entries(dailyTrips).map(([date, count]) => (
              <p key={date}>{`${new Date(
                date
              ).toDateString()}: ${count} trips`}</p>
            ))}
          </Card>
        </div>

        {/* Volume of Waste Transferred by STS Today */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            title="Volume of Waste Transferred by STS Today"
            bordered={false}
            style={{ width: 600 }}
          >
            {stsWasteTransferred.map((sts) => (
              <p key={sts.stsID}>
                STS ID: {sts.stsID}, Volume Transferred:{" "}
                {sts.volumeOfWasteTransferred} cubic meters
              </p>
            ))}
          </Card>
        </div>

        

        {/* Total Volume of Waste Transferred in the Last 7 Days */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            title="Volume of Waste Transferred in the Last 7 Days"
            bordered={false}
            style={{ width: 600 }}
          >
            {Object.entries(totalVolume).map(([date, volume]) => (
              <p key={date}>{`${new Date(
                date
              ).toDateString()}: ${volume} cubic meters`}</p>
            ))}
          </Card>
        </div>

        {/* Daily Fuel Cost Card */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            title="Total Daily Fuel Cost for the Last 7 Days"
            bordered={false}
            style={{ width: "100%", maxWidth: 600 }}
          >
            {Object.entries(dailyCost).map(([date, cost]) => (
              <p key={date}>
                {new Date(date).toDateString()}: ${cost.toFixed(2)}
              </p>
            ))}
          </Card>
        </div>

        {/* Vehicles currently traveling towards Landfills */}
        <h1 style={{ fontSize: "24px", textAlign: "center", margin: "20px 0" }}>
          Get all the vehicles which are currently travelling towards Landfills.
        </h1>
        {spinning ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                  color: "black",
                }}
                spin
              />
            }
          />
        ) : vehiclesToLandfill.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
              paddingTop: "30px",
            }}
          >
            <h2>
              <i>বর্তমানে কোনো যানবাহন নেই</i>
            </h2>
            <BackButton />
          </div>
        ) : (
          <Row gutter={16}>
            {vehiclesToLandfill.map((vehicle, index) => (
              <Col span={8} key={index}>
                <Card
                  title={`Vehicle Number: ${vehicle.vehicleNumber}`}
                  bordered={false}
                >
                  <p>Landfill ID: {vehicle.landfillID}</p>
                  <p>Departure: {vehicle.timeOfDepartureSts}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Vehicles returning to STS */}
        <div style={{ marginTop: "40px" }}>
          <h1
            style={{ fontSize: "24px", textAlign: "center", margin: "20px 0" }}
          >
            Get all the vehicles which have dumped their waste and currently
            travelling back towards its STS.
          </h1>
          <Row gutter={16}>
            {vehiclesToSts.map((vehicle, index) => (
              <Col span={8} key={index}>
                <Card
                  title={`Vehicle Number: ${vehicle.vehicleNumber}`}
                  bordered={false}
                >
                  <p>Type: {vehicle.type}</p>
                  <p>Capacity: {vehicle.capacity}</p>
                  <p>STS ID: {vehicle.stsID}</p>
                  <p>Landfill ID: {vehicle.landfillID}</p>
                  <p>
                    Departure from Landfill:{" "}
                    {new Date(
                      vehicle.timeOfDepartureLandfill
                    ).toLocaleDateString()}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
};

export default RunningProgramsPage;
