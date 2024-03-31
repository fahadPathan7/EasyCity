import "./NavBar.css";
import navLogo from "../../assets/images/Econsync1.png";

import HomeIcon from "@mui/icons-material/Home";

import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { message } from "antd";
import axios from "axios";
import DashBoard from "../../pages/dashBoard/DashBoard";
export default function NavBar() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.delete("http://localhost:3000/auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("token"); // Remove the token from local storage on successful logout
        message.success(response.data.message); // Display success message
        navigate("/login"); // Redirect to the login page
      }
    } catch (error) {
      // Handle errors here. For example, you could display a notification message.
      console.error("Logout error:", error);
      message.error("An error occurred during logout.");
    }
  };

  return (
    <>
      <div className="navCanvas">
        <div
          onClick={() => {
            navigate("/userProfile");
          }}
          className="navLogo"
        >
          <img src={navLogo} alt="" />
        </div>

        <div className="navRightContainer">
          <div
            className="navElement"
            onClick={() => {
              navigate("/homepage");
            }}
          >
            <HomeIcon fontSize="medium" />
            <span className="dashboadNavText">হোমপেজ</span>
          </div>

          <div
            className="navElement"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            {" "}
            <DashboardIcon fontSize="medium" />
            <span className="firmsNavText">ড্যাশবোর্ড</span>
          </div>
          <div
            className="navElement"
            onClick={() => {
              navigate("/userProfile");
            }}
          >
            <span className="dashboadNavText">নিজ প্রোফাইল দেখুন</span>
          </div>  
          <div
            className="navButton"
            onClick={() => {
              logout();
            }}
          >
            <LogoutIcon fontSize="medium" />
            <span className="logoutNavText">লগআউট</span>
          </div>
        </div>
      </div>
    </>
  );
}
