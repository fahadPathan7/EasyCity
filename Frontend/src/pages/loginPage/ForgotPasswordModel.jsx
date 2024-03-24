import { Modal, Button, Form, Input, message } from "antd";
import axios from "axios";
import Countdown from "react-countdown";
import { useState } from "react";
import PropTypes from "prop-types";
import backendURL from "../../lib/backendURL";

const ForgetPasswordModal = (props) => {
  const { isModalOpen, setIsModalOpen } = props;

  const [modalInput, setModalInput] = useState("");
  const [modaTitle, setModalTitle] = useState("Enter your Email");
  const [modalState, setModalState] = useState("email");
  const [loading, setLoading] = useState(false);

  const resetModal = () => {
    setLoading(false);
    setModalInput("");
    setIsModalOpen(false);
    setModalTitle("Enter your Email");
    setModalState("email");
  };

  const handleUpdateOk = async (values) => {
    console.log(values.confirm);
    setLoading(true);
    try {
      await axios.post(
        backendURL + "api/auth/updatepassword",
        { password: values.confirm },
        {
          headers: { Authorization: localStorage.getItem("otptoken") },
          withCredentials: true,
        }
      );

      message.success("Password Changed Successfully");
      resetModal();
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.msg);
    }
  };
  const handleOTPOk = async () => {
    setLoading(true);

    try {
      await axios.post(
        backendURL + "api/auth/validateotp",
        { otp: parseInt(modalInput) },
        {
          headers: { Authorization: localStorage.getItem("otptoken") },
          withCredentials: true,
        }
      );
      setLoading(false);
      setModalInput("");
      setModalTitle("Update Your Password");
      setModalState("password");
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.msg);
    }
  };

  const handleForgetEmailOk = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        backendURL + "api/auth/forgotpassword",
        {
          email: modalInput,
          withCredentials: true,
        }
      );
      localStorage.setItem("otptoken", "Bearer " + response.data.otptoken);
      setLoading(false);

      setModalTitle("Enter your OTP");
      setModalInput("");
      setModalState("otp");
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.msg);
    }
  };

  const modalStateHandlers = {
    email: handleForgetEmailOk,
    otp: handleOTPOk,
    password: handleUpdateOk,
  };

  const modalStateContents = {
    otp: (
      <>
        <p>You have 2 minutes to enter OTP</p>
        <Countdown
          date={Date.now() + 120000}
          onComplete={() => {
            message.error("Time out for entering OTP");
            resetModal();
          }}
        />
        <Input
          value={modalInput}
          onChange={(e) => {
            setModalInput(e.target.value);
          }}
        />
      </>
    ),
    email: (
      <Input
        value={modalInput}
        onChange={(e) => {
          setModalInput(e.target.value);
        }}
      />
    ),
    password: (
      <>
        <Form onFinish={handleUpdateOk}>
          <Form.Item
            label="Enter New Password"
            name="password"
            rules={[
              { required: true, message: "Please Enter Your New Password" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirm"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    ),
  };

  return (
    <Modal
      open={isModalOpen}
      title={modaTitle}
      footer={
        modalState == "password"
          ? []
          : [
              <Button
                key="back"
                onClick={() => {
                  setModalState("email");
                  setModalTitle("Enter your Email");
                  setModalInput("");
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={modalStateHandlers[modalState]}
              >
                Submit
              </Button>,
            ]
      }
    >
      {modalStateContents[modalState]}
    </Modal>
  );
};

ForgetPasswordModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};

export default ForgetPasswordModal;