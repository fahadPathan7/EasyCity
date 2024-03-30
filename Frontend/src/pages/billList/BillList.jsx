import { useEffect, useState } from "react";
import IconButton from "../../components/iconButton/IconButton";
import NavBar from "../../components/navBar/NavBar";
import "./BillList.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/backButton/BackButton";
import backendURL from "../../lib/backendURL";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function BillList() {
  const navigate = useNavigate();

  const [billList, setBillList] = useState([]);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(backendURL+"/bill/getBills", {
        //   headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        });
        console.log(res.data.bills);
        setBillList(res.data.bills);
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
            <div className="main-title-myfirms">  বিলসমূহ দেখুন </div>
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
            ) : billList.length == 0 ? (
              emptyFirmList()
            ) : (
              billList.map((bill) => {
                return (
                  <div
                    className="myfirms-firmcard"
                    key={bill.billID}
                     onClick={() => {
                       navigate("/billList/" + bill.billID, { state: { billID: bill.billID } });

                     }}
                    >
                    <p>{ bill.billID}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="myfirms-right-canvas">
          <div className="myfirms-upper-right-empty-space"></div>
         
        </div>
      </div>
    </>
  );
}