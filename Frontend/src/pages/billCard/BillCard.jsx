import { useState, useEffect } from "react";
import NavBar from "../../components/navBar/NavBar";
import "./BillCard.css";
import _ from "lodash";
import { message } from "antd";
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
    navigate('/billDownloadPage', { state: { billID: billIDData } });
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
                {/* Display bill information here */}
                <tr>
                  <td>বিল আইডি</td>
                  <td>{billInfo.billID}</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
          {/* Add more content as needed */}
        </div>
        {/* Download Button */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleDownloadClick} className="download-button">Download Bill</button>
        </div>
      </div>
    </>
  );
}
