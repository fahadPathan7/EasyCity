import DarkButton from "../../components/darkButton/DarkButton";
import { useState } from "react";
import { Input, Space, Button, Spin } from "antd";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import backendURL from "../../lib/backendURL";
import { LoadingOutlined } from "@ant-design/icons";

import "./SignupPage.css";
import BackButton from "../../components/backButton/BackButton";
const SignupForm = () => {
  /// fOR MODAL
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalRoute, setModalRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (route) => {
    setIsModalOpen(false);
    if (route) {
      navigate(route, {
        state: {
          uid: 1,
        },
      });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(falsea);
  };
  /// fOR MODAL

  let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  // let emailRegex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    if (
      e.target.name === "mobile" &&
      !(
        typeof Number(e.target.value) === "number" &&
        !Number.isNaN(Number(e.target.value))
      )
    )
      return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation checks...
    if (!user.name) message.error("ইউজারনেম দিন");
    else if (user.name.length < 4)
      message.error("ইউজারনেম নুন্যতম ৪ অক্ষরের হতে হবে");
    else if (!user.mobile) message.error("ফোন নম্বর দিন");
    else if (user.mobile.length !== 11) message.error("ফোন নম্বর সঠিক নয়");
    else if (!user.email) message.error("ইমেইল দিন");
    else if (!emailRegex.test(user.email)) message.error("ইমেইল সঠিক নয়");
    else if (!user.password) message.error("পাসওয়ার্ড দিন");
    else if (user.password.length < 6)
      message.error("পাসওয়ার্ড নুন্যতম ৬ অক্ষরের হতে হবে");
    else if (user.password !== user.confirmPassword)
      message.error("পাসওয়ার্ড দুইটি একই হয়নি");
    else {
      const retVal = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        roleID: 4,
      };

      try {
        const response = await axios.post(`${backendURL}/auth/create`, retVal, {
          withCredentials: true,
        });
        // Handle success...
        setModalText(
          `Congratulations ${retVal.name}! Your registration is successful`
        );
        localStorage.setItem("token", "Bearer " + response.data.token);
        setModalTitle("Your registrations is successful");
        showModal();
      } catch (error) {
        console.error("Error:", error);
        // Handling specific errors for duplicate email or phone number
        if (error.response && error.response.data) {
          if (error.response.data.includes("duplicate email")) {
            message.error("এই ইমেইলে পূর্বে রেজিস্টার করা হয়েছে");
          } else if (error.response.data.includes("duplicate phone number")) {
            message.error("এই মোবাইল নাম্বারে পূর্বে রেজিস্টার করা হয়েছে");
          } else {
            // Generic error handling
            setModalText(
              error.response.data.msg || "An error occurred. Please try again."
            );
            setModalTitle("An Error Occured");
          }
        } else {
          // Fallback error handling
          setModalText("An error occurred. Please try again.");
          setModalTitle("An Error Occured");
        }
        showModal();
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      {/* fOR MODAL*/}
      <BackButton />
      <Modal
        title={modalTitle}
        open={isModalOpen}
        footer={[
          <Button
            type="primary"
            key="button"
            onClick={() => {
              handleOk(modalRoute);
            }}
          >
            OK
          </Button>,
        ]}
        closeIcon={null}
      >
        <p>{modalText}</p>
      </Modal>
      {/* fOR MODAL*/}

      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="signup-form-row">
          <Space direction="horizontal">
            <label htmlFor="name" className="signup-form-label">
              ইউজারনেম
            </label>
            <Input
              size="large"
              placeholder="আপনার ইউজারনেম দিন"
              className="signup-form-input"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </Space>
        </div>

        <div className="signup-form-row">
          <Space direction="horizontal">
            <label htmlFor="name" className="signup-form-label">
              ফোন নম্বর
            </label>
            <Input
              size="large"
              placeholder="ফোন নম্বর দিন"
              className="signup-form-input"
              id="mobile"
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              addonBefore="+88"
            />
            {/* <Input
              size="large"
              placeholder="ফোন নম্বর দিন"
              className="signup-form-input"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            /> */}
          </Space>
        </div>

        <div className="signup-form-row">
          <Space direction="horizontal">
            <label htmlFor="name" className="signup-form-label">
              ইমেইল
            </label>
            <Input
              size="large"
              placeholder="আপনার ইমেইল দিন"
              className="signup-form-input"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </Space>
        </div>

        <div className="signup-form-row">
          <Space direction="horizontal">
            <label htmlFor="password" className="signup-form-label">
              পাসওয়ার্ড
            </label>
            <Input.Password
              size="large"
              placeholder="পাসওয়ার্ড দিন"
              className="signup-form-input"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              visibilityToggle={{
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Space>
        </div>

        <div className="signup-form-row">
          <Space direction="horizontal">
            <label htmlFor="password" className="signup-form-label">
              পাসওয়ার্ড নিশ্চায়ন
            </label>
            <Input.Password
              size="large"
              placeholder="পুনরায় আপনার পাসওয়ার্ড দিন"
              className="signup-form-input"
              id="confirmPassword"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              visibilityToggle={{
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Space>
        </div>

        <div className="registerbtn">
          {!isLoading ? (
            <DarkButton
              buttonText="প্রবেশ করুন"
              onClick={() => {}}
              routePath="forbidden"
              type="submit"
            />
          ) : (
            <>
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
              <div>It will take few minutes for the first time Signing up</div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
