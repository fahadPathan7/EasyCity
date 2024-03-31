import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import axios from 'axios';
import backendURL from '../../lib/backendURL'; // Assuming this exists and is correct

const ChangePassword = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewPassword('');
  };

 const handleChangePassword = async () => {
    console.log("Attempting to change password to:", newPassword); // For debugging purposes only

    setLoading(true);
    try {
      const response = await axios.put(
        `${backendURL}/auth/change-password`,
        { newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        message.success(response.data.message || 'Password updated successfully.');
        handleCancel(); // Reset and close the modal
      }
    } catch (error) {
      console.error("Error:", error.response || error); // Log the error object for more details
      message.error(error.response?.data?.message || 'An error occurred while updating the password.');
    } finally {
      setLoading(false);
    }
};


  return (
    <>
      <Button type="primary" onClick={showModal}>
        Change Password
      </Button>
      <Modal
        title="Change Password"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleChangePassword}>
            Submit
          </Button>,
        ]}
      >
        <Form
          name="changePassword"
          initialValues={{ remember: true }}
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please input your new password!' }]}
          >
            <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePassword;
