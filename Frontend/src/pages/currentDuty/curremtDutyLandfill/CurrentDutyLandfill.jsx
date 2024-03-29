import { useEffect, useState } from "react";
import IconButton from "../../../components/iconButton/IconButton";
import NavBar from "../../../components/navBar/NavBar";
import "./CurrentDutyLandfill";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../../components/backButton/BackButton";
import backendURL from "../../../lib/backendURL";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function STSList() {
  const navigate = useNavigate();

  const [stsList, setStsList] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [landfillInfo, setLandfillInfo] = useState(null);

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/landfill/check-manager"
        );
        console.log(res.data);
        setLandfillInfo(res.data.landfill);
      } catch (error) {
        console.log(error);
      }
      setSpinning(false);
    };
    fetchData();
  }, []);

  function emptyFirmList() {
    return <div className="firm-list-empty-title"></div>;
  }

  function displayLandfillInfo() {
    // Render landfill info here
    return (
      <div className="landfill-info">
        <p>landfillID: {landfillInfo.landfillID}</p>
        <p>name: {landfillInfo.name}</p>
        <p>volumeOfWaste: {landfillInfo.volumeOfWaste}</p>
        <p>operationalTimespan: {landfillInfo.operationalTimespan}</p>
        <p>latitude: {landfillInfo.latitude}</p>
        <p>longitude: {landfillInfo.longitude}</p>
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
            <div className="main-title-myfirms">STS LIST</div>
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
            ) : landfillInfo ? (
              <>
                {displayLandfillInfo()}
                {stsList.length === 0
                  ? emptyFirmList()
                  : stsList.map((sts) => {
                      return (
                        <div
                          className="myfirms-firmcard"
                          key={sts.stsID}
                          onClick={() => {
                            navigate("/sts/" + sts.stsID, { state: { sts } });
                          }}
                        >
                          <p>{sts.stsID}</p>
                        </div>
                      );
                    })}
              </>
            ) : (
              <div>Error fetching landfill info</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
