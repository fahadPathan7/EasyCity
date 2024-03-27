import { useEffect, useState } from "react";
import IconButton from "../../../components/iconButton/IconButton";
import NavBar from "../../../components/navBar/NavBar";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../../components/backButton/BackButton";
import backendURL from "../../../lib/backendURL";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./LandfillList.css";

export default function LandfillList() {
  const navigate = useNavigate();

  const [landfillList, setLandfillList] = useState([]);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(backendURL + "/landfill/all-landfills", {
          //   headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        });
        console.log(res.data.landfills);
        setLandfillList(res.data.landfills);
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
        নতুন LandFill যুক্ত করতে নিচের বাটনে কিল্ক করুন
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
            <div className="main-title-myfirms">LandFill LIST</div>
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
            ) : landfillList.length == 0 ? (
              emptyFirmList()
            ) : (
              landfillList.map((landfills) => {
                return (
                  <div
                    className="myfirms-firmcard"
                    key={landfills.landfillID}
                    onClick={() => {
                      navigate("/landfill/" + landfills.landfillID, { state: { landfills } });
                    }}
                  >
                    {landfills.landfillID}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="myfirms-right-canvas">
          <div className="myfirms-upper-right-empty-space"></div>
          <IconButton
            buttonText={"নতুন Landfill যুক্ত করুন"}
            iconName={"mail"}
            url={"/addNewLandfill"}
          />
        </div>
      </div>
    </>
  );
}
