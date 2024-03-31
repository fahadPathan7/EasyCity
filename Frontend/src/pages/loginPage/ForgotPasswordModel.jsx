import { Modal, Button, Form, Input, message } from "antd";
import axios from "axios";
import Countdown from "react-countdown";
import { useState } from "react";
import PropTypes from "prop-types";
import backendURL from "../../lib/backendURL";

const ForgetPasswordModal = (props) => {
  const { isModalOpen, setIsModalOpen } = props;

  const [modalInput, setModalInput] = useState("");
  const [modalCode, setModalCode] = useState(""); // For storing the code input by the user
  const [modalTitle, setModalTitle] = useState("Enter your Email");
  const [modalState, setModalState] = useState("email");
  const [loading, setLoading] = useState(false);

  const resetModal = () => {
    setLoading(false);
    setModalInput("");
    setModalCode("");
    setIsModalOpen(false);
    setModalTitle("Enter your Email");
    setModalState("email");
  };

  // Handle initiating password reset
const handleForgetEmailOk = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${backendURL}/auth/reset-password/initiate`,
        { email: modalInput },
        { withCredentials: true }
      );
      setLoading(false);
      message.success("Code sent to the email.");
      setModalTitle("Enter the Code from Your Email");
      // Do not clear modalInput here to retain the email value
      setModalState("otp");
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.msg);
    }
};



  // Handle finalizing password reset
  const handleUpdateOk = async (values) => {
    setLoading(true);
    console.log("Sending data to backend:", {
      code: modalCode,
      email: modalInput,
      newPassword: values.confirm,
    });
    try {
      await axios.post(
        "http://localhost:3000/auth/reset-password/confirm",
        {
          code: modalCode,
          email: modalInput,
          newPassword: values.confirm,
        },
        { withCredentials: true }
      );

      message.success("Password updated successfully.");
      resetModal();
    } catch (error) {
      setLoading(false);
      console.error("Error sending data to backend:", error);
      message.error(
        error.response ? error.response.data.msg : "An unknown error occurred"
      );
    }
  };

  const modalStateHandlers = {
    email: handleForgetEmailOk,
    otp: () => setModalState("password"),
    password: handleUpdateOk,
  };

  const modalStateContents = {
    otp: (
      <>
        <p>You have a limited time to enter the code sent to your email</p>
        <Input
          placeholder="Enter Code"
          value={modalCode}
          onChange={(e) => {
            setModalCode(e.target.value);
          }}
        />
      </>
    ),
    email: (
      <Input
        placeholder="Enter your Email"
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
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
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
      title={modalTitle}
      footer={
        modalState == "password"
          ? []
          : [
              <Button key="back" onClick={resetModal}>
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
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default ForgetPasswordModal;
