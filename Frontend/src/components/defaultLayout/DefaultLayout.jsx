import React from "react";
import { Breadcrumb, Layout, Menu, theme, message } from "antd";
const { Header, Content, Footer } = Layout;
import navLogo from "../../assets/images/Econsync.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DefaultLayout.css";
import useAuth from '../../hooks/useAuth';

const logout = async () => {
  try {
    const response = await axios.delete(`http://localhost:3000/auth/logout`);
    if (response.status === 200) {
      message.success("Logout successful.");
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
    message.error("Logout failed. Please try again.");
  }
};

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { status, isSTSManager, isAdmin, isLandfillManager, isUnassigned } = useAuth();
  
  // Dynamically filter items based on user roles
  let filteredItems = [
    {
      key: "Dashboard",
      label: "See Dashboard Here",
      onClick: () => {
        navigate("/dashboard");
      },
    },
    {
      key: "user-profile",
      label: "User Profile",
      onClick: () => {
        navigate("/userProfile");
      },
    },
  ];

  // Add User List and User Roles if the user is not STS Manager, Landfill Manager, or Unassigned
  if (!isSTSManager && !isLandfillManager && !isUnassigned) {
    filteredItems = [
      ...filteredItems,
      {
        key: "User List",
        label: "User List",
        onClick: () => {
          navigate("/userList");
        },
      },
      {
        key: "User Roles",
        label: "User Roles",
        onClick: () => {
          navigate("/userRoles");
        },
      }
    ];
  }

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
          justifyContent: "space-between",
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
          items={filteredItems}
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
