import { useLocation } from "react-router-dom";
import NavBar from "../../components/navBar/NavBar";
import backendURL from "../../lib/backendURL";

import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Dashboard() {
  const [homepageProgramList, setHomepageProgramList] = useState([]);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [firmCount, setFirmCount] = useState(0);
  const [username, setUsername] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    setSpinning(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(backendURL + "/dashboard", {
          //   headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        });
        // console.log(localStorage.getItem("token"));
        // console.log(res);
        setHomepageProgramList(res.data.Invoice);
        setInvoiceCount(res.data.invoiceCount);
        setBillCount(res.data.billCount);

        setUsername(res.data.username);
        setNewsData(res.data.newsData);
        setSpinning(false);
        // setInvoiceCount(res.data.)
      } catch (error) {
        alert(error.response.data.msg);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />

      <div>Hello</div>
    </>
  );
}
