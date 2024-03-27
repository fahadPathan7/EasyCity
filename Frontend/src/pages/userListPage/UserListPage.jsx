import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, message, Space } from "antd";
import { Select } from "antd";
import Highlighter from "react-highlight-words";

const UserListPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllUsers();
    fetchRoles();
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
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // const userData = { ...values };
      const roleIDsArray = values.roleIDs.map((id) => parseInt(id));
      const userData = {
        ...values,
        roleIDs: roleIDsArray,
      };
      // console.log(userData);
      if (!editUser) {
        const { data: newUser } = await axios.post(
          "http://localhost:3000/auth/create",
          userData,
          {
            withCredentials: true,
          }
        );
        //setUsersData((prev) => [...prev, newUser]);
        message.success("User Added Successfully");
        getAllUsers();
      } else {
        await axios.put(
          `http://localhost:3000/users/${editUser.userID}`,
          userData,
          { withCredentials: true }
        );

        let shouldFetchUsers = true;

        // If roles have changed, update roles before fetching the user list
        if (
          JSON.stringify(editUser.roleIDs.sort()) !==
          JSON.stringify(values.roleIDs.sort())
        ) {
          await axios.put(
            `http://localhost:3000/users/${editUser.userID}/roles`,
            { roleIDs: values.roleIDs },
            { withCredentials: true }
          );
          message.success("User and Roles Updated Successfully");
        } else {
          message.success("User Updated Successfully");
        }

        // Update local state without refetching from the backend
        if (shouldFetchUsers) {
          getAllUsers();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Something Went Wrong");
    } finally {
      setLoading(false);
      setPopupModal(false);
      // Remove the getAllUsers call from here to prevent premature fetch
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleSearch2 = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery)
  );

  const columns = [
    {
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
      ...getColumnSearchProps("userID"),
      sorter: (a, b) => a.userID - b.userID, // Add sorter function for sorting user IDs
      sortDirections: ["ascend", "descend"], // Allow sorting in both ascending and descending order
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name), // Add sorter function for sorting names alphabetically
      sortDirections: ["ascend", "descend"], // Allow sorting in both ascending and descending order
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.localeCompare(b.email), // Add sorter function for sorting emails alphabetically
      sortDirections: ["ascend", "descend"], // Allow sorting in both ascending and descending order
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
      ...getColumnSearchProps("mobile"),
      sorter: (a, b) => a.mobile.localeCompare(b.mobile), // Add sorter function for sorting phone numbers alphabetically
      sortDirections: ["ascend", "descend"], // Allow sorting in both ascending and descending order
    },
    {
      title: "Roles",
      dataIndex: "roleIDs",
      key: "roleIDs",
      render: (roleIDs) => {
        const roleNames = roleIDs
          .map((roleID) => {
            const role = roles.find((r) => r.roleID === roleID);
            return role ? role.roleName : "Unassigned Role";
          })
          .join(", ");
        return roleNames;
      },
      // Optionally, apply getColumnSearchProps if you want search functionality on roles,
      // but ensure you adapt the onFilter function to handle the roleIDs array properly.
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              setEditUser(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>User List</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Add User
        </Button>
      </div>
      <Input
        placeholder="Search by name, email, or phone"
        value={searchQuery}
        onChange={handleSearch2}
        style={{ width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="userID"
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
            initialValues={{ ...editUser }}
            onFinish={handleSubmit}
          >
            {/* Form fields */}
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[
                { required: true, message: "Please input your mobile number!" },
              ]}
            >
              <Input />
            </Form.Item>
            {/* Assuming roles are selectable and you've fetched them into your `roles` state */}
            <Form.Item
              name="roleIDs"
              label="Roles"
              rules={[
                { required: true, message: "Please select at least one role!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Please select"
                optionFilterProp="children"
              >
                {roles.map((role) => (
                  <Select.Option key={role.roleID} value={role.roleID}>
                    {role.roleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {editUser && (
              <Form.Item
                name="userID"
                label="User ID"
                rules={[{ required: true, message: "User ID is required" }]}
              >
                <Input disabled />
              </Form.Item>
            )}
            {!editUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input a password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}
            {/* End of the form fields */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button
                onClick={() => setPopupModal(false)}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default UserListPage;
