import { useEffect, useState } from "react";
import IconButton from "../../../components/iconButton/IconButton";
import NavBar from "../../../components/navBar/NavBar";
import "./VehicleList.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../../components/backButton/BackButton";
import backendURL from "../../../lib/backendURL";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function VehicleList() {
  const navigate = useNavigate();

  const [vehicleList, setVehicleList] = useState([]);
  const [spinning, setSpinning] = useState(true);
  console.log(vehicleList);
  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(backendURL+"/vehicle/all-vehicles", {
        //   headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        });
        console.log(res.data.vehicles);
        setVehicleList(res.data.vehicles);
      } catch (error) {
        console.log(error);
      }
      setSpinning(false);
    };
    fetchData();    
  }, []);

  function emptyFirmList() {
    return (
      <div className="firm-list-empty-title">
        নতুন ট্রাক যুক্ত করতে নিচের বাটনে কিল্ক করুন
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="myfirmspage-canvas">
        <div className="myfirms-left-canvas">
          <div className="myfirms-title-section">
            <BackButton />
            <div className="main-title-myfirms">ট্রাক লিস্ট</div>
          </div>
          <div className="myfirms-firm-list-container">
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
            ) : vehicleList.length == 0 ? (
              emptyFirmList()
            ) : (
              vehicleList.map((vehicle) => {
                return (
                  <div
                    className="myfirms-firmcard"
                    key={vehicle.vehicleNumber}
                     onClick={() => {
                       navigate("/vehicle/" + vehicle.vehicleNumber, { state: { vehicle } });
                     }}
                    >
                    <p>{ vehicle.vehicleNumber}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="myfirms-right-canvas">
          <div className="myfirms-upper-right-empty-space"></div>
          <IconButton
            buttonText={"নতুন ট্রাক যুক্ত করুন"}
            iconName={"mail"}
            url={"/addNewVehicle"}
          />
        </div>
      </div>
    </>
  );
}