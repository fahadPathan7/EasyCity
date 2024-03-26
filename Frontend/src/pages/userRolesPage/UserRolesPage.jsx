import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";
import { Button, Table, Modal, Form, Input, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const UserRolePage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/users/roles/all", {
        withCredentials: true,
      });
      setRoles(data.roles);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching roles:", error);
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setRoleName("");
    setAddModalVisible(true);
  };

  const handleSaveRole = async () => {
    try {
      setLoading(true);
      const newRole = {
        roleName: roleName,
      };
      await axios.post("http://localhost:3000/rbac/role", newRole, {
        withCredentials: true,
      });
      message.success("Role added successfully");
      fetchRoles();
      setAddModalVisible(false);
    } catch (error) {
      message.error("Failed to add role");
      console.error("Error adding role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Role ID", dataIndex: "roleID" },
    { title: "Role Name", dataIndex: "roleName" },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between mb-3">
        <h1>User Role List</h1>
        <div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by role name"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <Button type="primary" onClick={handleAddRole}>
            <PlusOutlined /> Add Role
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={filteredRoles} loading={loading} />

      <Modal
        title="Add New Role"
        visible={addModalVisible}
        onOk={handleSaveRole}
        onCancel={() => setAddModalVisible(false)}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default UserRolePage;
