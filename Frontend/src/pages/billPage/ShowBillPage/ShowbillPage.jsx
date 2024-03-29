import { useState, useEffect } from "react";
import NavBar from "../../../components/navBar/NavBar";
import "./ShowBillPage.css";
import _ from "lodash";

import { message } from "antd";
import { Space, Table, Input, Rate } from "antd";
import DarkButton from "../../../components/darkButton/DarkButton";
import { useNavigate, useParams } from "react-router-dom";
import { alertClasses } from "@mui/material";
import { useLocation } from "react-router-dom";
import BackButton from "../../../components/backButton/BackButton";
import axios from "axios";
import backendURL from "../../../lib/backendURL";
export default function ShowBillPage() {
  const [spinning, setSpinning] = useState(true);
  const [billInfo, setBillInfo] = useState([]);

  const location = useLocation();
  const billIDData = location.state?.billID;
  console.log(billIDData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendURL + `/bill/${billIDData}`, {
          withCredentials: true,
        });
        // Set billInfo to the fetched data directly
        setBillInfo(response.data.bill);
        setSpinning(false);
      } catch (error) {
        message.error(error.response.data.msg);
      }
    };
    fetchData();
  }, [billIDData]);

  return (
    <>
      <NavBar />
      <div className="addbilldistance-canvas">
        <div className="addbilldistance-title">
          <BackButton />
          বিল দেখুন
        </div>
        <div className="addbilldistance-container">
          <div className="addbilldistance-table">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">প্রথম সেকশন</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>বিল আইডি</td>
                  <td>{billInfo.billID}</td>
                </tr>
                <tr>
                  <td>ট্রাক নাম্বার</td>
                  <td>{billInfo.vehicleNumber}</td>
                </tr>
                <tr>
                  <td>ধারণক্ষমতা</td>
                  <td>{billInfo.capacity}</td>
                </tr>
                <tr>
                  <td>ময়লার পরিমাণ</td>
                  <td>{billInfo.volumeOfWaste}</td>
                </tr>
                <tr>
                  <td>স্থানান্তরকরণের সময় (STS)</td>
                  <td>{billInfo.timeOfDepartureSts}</td>
                </tr>
                <tr>
                  <td>স্থানান্তরকরণের সময় (Landfill)</td>
                  <td>{billInfo.timeOfArrivalLandfill}</td>
                </tr>
                <tr>
                  <td>প্রতি কিলোমিটারের মূল্য (Landfill)</td>
                  <td>{billInfo.costPerKilometerToLandfill}</td>
                </tr>
                <tr>
                  <td>প্রতি কিলোমিটারের মূল্য (STS)</td>
                  <td>{billInfo.costPerKilometerToBackToSts}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="addbilldistance-table">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">দ্বিতীয় সেকশন</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>STS নাম্বার</td>
                  <td>{billInfo.stsID}</td>
                </tr>
                <tr>
                  <td>ল্যান্ডফিল আইডি</td>
                  <td>{billInfo.landfillID}</td>
                </tr>
                <tr>
                  <td>দায়িত্বপ্রাপ্ত ল্যান্ডফিল ম্যানেজার</td>
                  <td>{billInfo.responsibleLandfillManager}</td>
                </tr>
                <tr>
                  <td>উপযোগিতা</td>
                  <td>{billInfo.capacity}</td>
                </tr>
                <tr>
                  <td>ময়লার পরিমাণ</td>
                  <td>{billInfo.volumeOfWaste}</td>
                </tr>
                <tr>
                  <td>প্রতি কিলোমিটারের মূল্য (Landfill)</td>
                  <td>{billInfo.costPerKilometerToLandfill}</td>
                </tr>
                <tr>
                  <td>প্রতি কিলোমিটারের মূল্য (STS)</td>
                  <td>{billInfo.costPerKilometerToBackToSts}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
