/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, Modal, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import navLogo from "../../assets/images/Econsync.png";
import LogoutIcon from "@mui/icons-material/Logout";
import "./DefaultLayout.css";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import backendURL from "../../lib/backendURL";
// Ensure this points to your backend
// Example: const backendURL = "http://localhost:3000";

const { Header, Content, Footer } = Layout;

const logout = async () => {
  try {
    const response = await axios.delete(`${backendURL}/auth/logout`);
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
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handlePasswordChange = async (values) => {
    try {
      const response = await axios.put(
        `${backendURL}/auth/change-password`,
        { newPassword: values.newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        message.success("Password updated successfully.");
        form.resetFields();
        setIsChangePasswordModalVisible(false);
        navigate("/homepage");
      }
    } catch (error) {
      message.error("Failed to update password. Please try again.");
    }
  };

  let menuItems = [
    {
      key: "homepage",
      label: "হোমপেজ",
      onClick: () => {
        navigate("/homepage");
      },
    },
    {
      key: "userProfile",
      label: "নিজ প্রোফাইল দেখুন",
      onClick: () => {
        navigate("/userProfile");
      },
    },
    {
      key: "changePassword",
      label: "পাসওয়ার্ড পরিবর্তন করুন",
      onClick: () => setIsChangePasswordModalVisible(true),
    },
    {
      key: "signup",
      label: "নতুন ম্যানেজার/এডমিন নিবন্ধন করুন",
      onClick: () => {
        navigate("/signup");
      },
    },
  ];

  if (!isSTSManager && !isLandfillManager && !isUnassigned) {
    menuItems = [
      ...menuItems,
      {
        key: "userList",
        label: "ইউজার লিস্ট",
        onClick: () => {
          navigate("/userList");
        },
      },
      {
        key: "userRoles",
        label: "ইউজার ভূমিকা",
        onClick: () => {
          navigate("/userRoles");
        },
      },
    ];
  }

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
        <div onClick={() => navigate("/userProfile")} className="navLogo">
          <img src={navLogo} alt="logo" />
        </div>
        <Menu theme="dark" mode="horizontal" items={menuItems} style={{ flex: 2, minWidth: 0 }} />
        <div className="navButton" onClick={logout}>
          <LogoutIcon fontSize="medium" />
          <span className="logoutNavText">লগআউট</span>
        </div>
      </Header>
      <Content
        style={{
          padding: "22px 48px",
          marginTop: "23px",
        }}
      >
        <Breadcrumb style={{ margin: "16px 0" }} />
        <div style={{ padding: 3, minHeight: 680, background: "#fff" }}>{children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }} />
      <Modal
        title="পাসওয়ার্ড পরিবর্তন করুন"
        visible={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Please input your new password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default DefaultLayout;
