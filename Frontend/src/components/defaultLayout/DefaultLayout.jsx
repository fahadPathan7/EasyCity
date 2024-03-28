/* eslint-disable react/prop-types */
import React from "react";
import { Breadcrumb, Layout, Menu, theme, message, Button } from "antd";
const { Header, Content, Footer } = Layout;
import backendURL from "../../lib/backendURL";
import navLogo from "../../assets/images/Econsync.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DefaultLayout.css";
// const items = new Array(3).fill(null).map((_, index) => ({
//   key: String(index + 1),
//   label: `nav ${index + 1}`,
// }));

const logout = async () => {
  try {
    // Note: Adjust the URL concatenation if backendURL does not end with a slash
    const response = await axios.delete(`http://localhost:3000/auth/logout`);
    if (response.status === 200) {
      message.success("Logout successful.");
      localStorage.removeItem("auth"); // Ensure you're removing the correct item
      // Redirect to login page or handle logout logic (e.g., clear session)
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
    message.error("Logout failed. Please try again.");
  }
};

const items = [
  // {
  //   key: "dashboard",
  //   label: "Dashboard",
  //   onClick: () => {
  //     window.location.href = "/dashboard";
  //   },
  // },
  {
    key: "user-profile",
    label: "User Profile",
    onClick: () => {
      window.location.href = "/userProfile";
    },
  },
  {
    key: "User List",
    label: "User List",
    onClick: () => {
      window.location.href = "/userList";
    },
  },
  {
    key: "User Roles",
    label: "User Roles",
    onClick: () => {
      window.location.href = "/userRoles";
    },
  },

  {
    key: "Dashboard",
    label: "Dashboard",
    onClick: () => {
      window.location.href = "/dashboard";
    },
  },
];

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 14,
          width: "100%",
          display: "flex",
          alignItems: "center",

          justifyContent: "space-between", // Added for spacing
        }}
      >
        <div className="demo-logo" />
        <div
          onClick={() => {
            navigate("/userProfile");
          }}
          className="navLogo"
        >
          <img src={navLogo} alt="" />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          className="custom-menu"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{
            flex: 2,
            minWidth: 0,
          }}
        />
        <div
          className="navButton"
          onClick={() => {
            logout();
          }}
        >
          <LogoutIcon fontSize="medium" />
          <span className="logoutNavText">লগআউট</span>
        </div>
      </Header>
      <Content
        style={{
          padding: "22 48px",
          marginTop: "-23px",
        }}
      >
        <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
        <div
          style={{
            padding: 3,
            minHeight: 680,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      ></Footer>
    </Layout>
  );
};

export default DefaultLayout;
