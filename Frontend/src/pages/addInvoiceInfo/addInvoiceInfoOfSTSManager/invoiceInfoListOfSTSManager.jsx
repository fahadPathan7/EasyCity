import { useEffect, useState } from "react";
import IconButton from "../../../components/iconButton/IconButton";
import NavBar from "../../../components/navBar/NavBar";
import "./invoiceInfoListOfSTSManager.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../../components/backButton/BackButton";
import backendURL from "../../../lib/backendURL";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function InvoiceInfoOfSTSManagerForm() {
  const navigate = useNavigate();

  const [stsVehicleList, setStsVehicleList] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          backendURL + "/vehicle/available-sts-vehicles",
          {
            withCredentials: true,
          }
        );
        console.log(res.data.vehicles);
        setStsVehicleList(res.data.vehicles);
        setErrorMessage("");
      } catch (error) {
        console.log(error);
        setErrorMessage("কিছু ভুল হয়েছে,পুনরায় দেখুন");
      }
      setSpinning(false);
    };
    fetchData();
  }, []);

  function emptyFirmList() {
    return (
      <div className="firm-list-empty-title">
        STS এ নিযুক্ত কোনো ট্রাক এই মুহূর্তে নেই!
      </div>
    );
  }

  // return (
  return (
    <>
      <NavBar />
      <div className="myfirmspage-canvas">
        <div className="myfirms-left-canvas">
          <div className="myfirms-title-section">
            <BackButton />
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
            ) : stsVehicleList.length == 0 ? (
              emptyFirmList()
            ) : (
              stsVehicleList.map((vehicle) => {
                return (
                  <div
                    className="myfirms-firmcard"
                    key={vehicle.vehicleNumber}
                    onClick={() => {
                      navigate(
                        "/addInvoiceInfoOfSTSManager/" + vehicle.vehicleNumber,
                        { state: { vehicle } }
                      );
                    }}
                  >
                    <p>{vehicle.vehicleNumber}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
//   <>
//     <NavBar />
//     <div className="myfirmspage-canvas">
//       <div className="myfirms-left-canvas">
//         <div className="myfirms-title-section">
//           <BackButton />
//           <div className="main-title-myfirms">STS LIST</div>
//         </div>
//         <div className="myfirms-firm-list-container">
//           {spinning === true ? (
//             <Spin
//               indicator={
//                 <LoadingOutlined
//                   style={{
//                     fontSize: 150,
//                     color: "black",
//                   }}
//                   spin
//                 />
//               }
//             />
//           ) : stsVehicleList.length == 0 ? (
//             emptyFirmList()
//           ) : (
//             stsVehicleList.map((vehicle) => {
//               return (
//                 <div
//                   className="myfirms-firmcard"
//                   key={vehicle.vehicleNumber}
//                   onClick={() => {
//                     navigate("/addInvoiceInfoOfSTSManager", {
//                       state: { vehicle },
//                     });
//                   }}
//                 >
//                   <p>{vehicle.vehicleNumber}</p>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//       <div className="myfirms-right-canvas">
//         <div className="myfirms-upper-right-empty-space"></div>
//       </div>
//     </div>
//   </>
// );
