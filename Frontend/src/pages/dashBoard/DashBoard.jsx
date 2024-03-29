import { useLocation } from "react-router-dom";
import NavBar from "../../components/navBar/NavBar";
import backendURL from "../../lib/backendURL";
import recentProgramList from "./recentProgramList";

import "./Dashboard.css";
import NewsCard from "./NewsCard";

import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import UserStatusCard from "./UserStatusCard";
import RecentProgramInfoCard from "../../components/RecentProgramInfoCard/RecentProgramInfoCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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
      <div className="home-canvas">
        <div className="home-news-canvas">
          <div className="home-news-title">সাম্প্রতিক সংবাদসমুহ</div>
          <div className="news-card-container">
            {spinning === true ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 70,
                      color: "black",
                    }}
                    spin
                  />
                }
              />
            ) : newsData ? (
              newsData.map((singleNews) => {
                return (
                  <NewsCard
                    newsText={singleNews.newsTitle}
                    newsLink={singleNews.newsLink}
                    key={singleNews.newsId}
                  />
                );
              })
            ) : (
              <h1>নতুন সংবাদ নেই</h1>
            )}
          </div>
        </div>
        <div className="home-right-canvas">
          <div className="home-profile-canvas">
            <div className="home-welcome-section">
              <marquee behavior="alternate" direction="left">
                DNCC স্বাগতম{" "}
                <span className="home-username">
                  {spinning === true ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 30,
                            color: "black",
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    username
                  )}
                </span>
              </marquee>
            </div>
            {/* <div className="home-profile-info-section">
              <div className="home-profile-info-card">
                <div className="profile-info-card-upper-section">
                  <CallIcon /> &nbsp; ফোন নম্বর
                </div>
                <div className="profile-info-card-lower-section">
                  +8801913112522
                </div>
              </div>
              <div className="home-profile-info-card">
                <div className="profile-info-card-upper-section">
                  <EmailIcon /> &nbsp; ইমেইল
                </div>
                <div className="profile-info-card-lower-section">
                  {" "}
                  codermehraj@gmail.com
                </div>
              </div>
            </div> */}
          </div>
          <div className="home-content-canvas">
            <div className="home-recent-program-canvas">
              <div className="home-recent-program-title">
                সাম্প্রতিক প্রোগ্রাম সমুহ
              </div>
              <div className="home-recent-program-cards-container">
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
                ) : homepageProgramList.length != 0 ? (
                  homepageProgramList.map((program) => {
                    return (
                      <RecentProgramInfoCard
                        {...program}
                        key={program.invoiceNo}
                      />
                    );
                  })
                ) : (
                  <>
                    <h1> কোনো প্রোগ্রাম নেই </h1>
                  </>
                )}
              </div>
            </div>
            <div className="home-user-status-canvas">
              <UserStatusCard
                title={"মোট প্রোগ্রাম"}
                number={
                  spinning === true ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 30,
                            color: "black",
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    invoiceCount
                  )
                }
              />
              <UserStatusCard
                title={"মোট বিল"}
                number={
                  spinning === true ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 30,
                            color: "black",
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    billCount
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
