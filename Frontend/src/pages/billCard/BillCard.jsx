import { useState, useEffect } from "react";
import NavBar from "../../components/navBar/NavBar";
import "./BillCard.css";
import _ from "lodash";
import { message, Button } from "antd";
import DarkButton from "../../components/darkButton/DarkButton";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import axios from "axios";
import backendURL from "../../lib/backendURL";

export default function BillCard() {
  const [spinning, setSpinning] = useState(true);
  const [billInfo, setBillInfo] = useState([]);
  const location = useLocation();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const billIDData = location.state?.billID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/bill/${billIDData}`, {
          withCredentials: true,
        });
        setBillInfo(response.data.bill);
        setSpinning(false);
      } catch (error) {
        message.error(error.response.data.msg);
      }
    };

    fetchData();
  }, [billIDData]);

  // Handler for download button click
  const handleDownloadClick = () => {
    // Navigate to billDownloadPage with billID
    navigate("/billDownloadPage", { state: { billID: billIDData } });
  };

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
                  <td>যাওয়ার পথে প্রতি কিলোমিটারের তেলের মূল্য (Landfill)</td>
                  <td>{billInfo.costPerKilometerToLandfill}</td>
                </tr>
                <tr>
                  <td>যাওয়ার পথে প্রতি কিলোমিটারের তেলের মূল্য (STS)</td>
                  <td>{billInfo.costPerKilometerToBackToSts}</td>
                </tr>
                <tr>
                  <td>বিল তৈরির সময়</td>
                  <td>{billInfo.createdAt}</td>
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
                  <td>Landfill আইডি</td>
                  <td>{billInfo.landfillID}</td>
                </tr>
                <tr>
                  <td>দায়িত্বপ্রাপ্ত Landfill ম্যানেজার</td>
                  <td>{billInfo.responsibleLandfillManager}</td>
                </tr>
                <tr>
                  <td>ময়লার ধারণক্ষমতা</td>
                  <td>{billInfo.capacity}</td>
                </tr>
                <tr>
                  <td>ময়লার পরিমাণ</td>
                  <td>{billInfo.volumeOfWaste}</td>
                </tr>
                <tr>
                  <td>ফেরার পথে প্রতি কিলোমিটারের তেলের মূল্য (Landfill)</td>
                  <td>{billInfo.costPerKilometerToLandfill}</td>
                </tr>
                <tr>
                  <td>ফেরার পথে প্রতি কিলোমিটারের তেলের মূল্য (STS)</td>
                  <td>{billInfo.costPerKilometerToBackToSts}</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Download Button */}
        
      </div>
      <DarkButton
        buttonText="হোমপেইজে যান"
        onClick={() => {}}
        routePath={"/homepage"}
      />
    </>
  );
}
