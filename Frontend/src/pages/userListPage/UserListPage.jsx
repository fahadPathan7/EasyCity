import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, message } from "antd";
import { Select } from "antd";

const UserListPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getAllUsers();
    //eslint-disable-next-line
  }, []);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/users", {
        withCredentials: true,
      });
      setUsersData(data.users); // Adjusted to match backend structure
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchRoles = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/users/roles/all",
        {
          withCredentials: true,
        }
      );
      setRoles(data.roles); // Assuming the backend structure is { roles: [{ roleID, roleName, ... }] }
    } catch (error) {
      console.log("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
    fetchRoles(); // Fetch roles when the component mounts
    //eslint-disable-next-line
  }, []);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/users/${record.userID}`, {
        withCredentials: true,
      });
      message.success("User Deleted Successfully");
      getAllUsers(); // Refresh list after deletion
      setPopupModal(false);
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "User ID", dataIndex: "userID" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "mobile" },
    {
      title: "Roles",
      dataIndex: "roleIDs",
      key: "roleIDs",
      render: (roleIDs) => {
        // Map each roleID to its roleName and join them with commas
        const roleNames = roleIDs
          .map((roleID) => {
            const role = roles.find((r) => r.roleID === roleID);
            return role ? role.roleName : "Unknown Role";
          })
          .join(", ");
        return roleNames;
      },
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditUser(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Convert roleIDs from comma-separated to an array
      const roleIDsArray = values.roleIDs.split(",").map((id) => id.trim());
      const userData = {
        ...values,
        roleIDs: roleIDsArray,
      };
      if (!editUser) {
        await axios.post("http://localhost:3000/auth/create", userData, {
          withCredentials: true,
        });
        message.success("User Added Successfully");
      } else {
        // Update user logic here if applicable
      }
      getAllUsers(); // Refresh the user list
      setPopupModal(false); // Close the modal
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>User List</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={usersData}
        bordered
        loading={loading}
      />
      {popupModal && (
        <Modal
          title={`${editUser ? "Edit User" : "Add New User"}`}
          visible={popupModal}
          onCancel={() => {
            setEditUser(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editUser || {}}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="roleIDs"
              label="Roles"
              rules={[
                { required: true, message: "Please select at least one role!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select roles"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {roles.map((role) => (
                  <Select.Option key={role.roleID} value={role.roleID}>
                    {role.roleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default UserListPage;
