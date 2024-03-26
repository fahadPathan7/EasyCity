/* eslint-disable react/prop-types */
import React from "react";
import { Breadcrumb, Layout, Menu, theme,message,Button } from "antd";
const { Header, Content, Footer } = Layout;
import backendURL from "../../lib/backendURL";
import axios from "axios"; 
// const items = new Array(3).fill(null).map((_, index) => ({
//   key: String(index + 1),
//   label: `nav ${index + 1}`,
// }));

const items = [
  {
    key: "dashboard",
    label: "Dashboard",
    onClick: () => {
      // Programmatically navigate to Dashboard
      window.location.href = "/dashboard";
    },
  },
  {
    key: "user-profile",
    label: "User Profile",
    onClick: () => {
      // Programmatically navigate to User Profile
      window.location.href = "/userProfile";
    },
  },
  {
    key: "User List",
    label: "User List",
    onClick: () => {
      // Programmatically navigate to Settings
      window.location.href = "/userList";
    },
  },
  {
    key: "User Roles",
    label: "User Roles",
    onClick: () => {
      // Programmatically navigate to Settings
      window.location.href = "/userRoles";
    },
  },
];

const logout = async () => {
    try {
      const response = await axios.delete(backendURL +"/auth/logout");
      if (response.status === 200) {
        message.success(response.data.message || "Logout successful.");
        // Redirect to login page or handle logout logic (e.g., clear session)
        window.location.href = "/login";
      }
    } catch (error) {
      message.error("Logout failed. Please try again.");
    }
};
  
const DefaultLayout = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Added for spacing
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        <Button type="primary" onClick={logout} style={{ marginLeft: "auto" }}>
          Logout
        </Button>
      </Header>
      <Content
        style={{
          padding: "22 48px",
          marginTop: "62px",
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