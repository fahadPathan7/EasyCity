import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const UserRolePage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const rolesRes = await axios.get("http://localhost:3000/users/roles", {
        withCredentials: true,
      });
      // Assuming your API does not support fetching permissions with roles in a single call
      const rolesWithPermissions = await Promise.all(
        rolesRes.data.roles.map(async (role) => {
          const permissionsRes = await axios.get(
            `http://localhost:3000/rbac/roles/${role.roleID}/permissions`,
            {
              withCredentials: true,
            }
          );
          return { ...role, permissions: permissionsRes.data.permissions };
        })
      );
      setRoles(rolesWithPermissions);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/rbac/permissions",
        {
          withCredentials: true,
        }
      );
      setPermissions(data.permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleAddRole = () => {
    setRoleName("");
    setSelectedPermissions([]);
    setAddModalVisible(true);
  };

  const handleSaveRole = async () => {
    setLoading(true);
    try {
      const newRole = {
        roleName,
        permissions: selectedPermissions,
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
  const handleDeletePermission = async (roleID, permissionName) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/rbac/roles/${roleID}/permissions/${permissionName}`,
        {
          withCredentials: true,
        }
      );
      message.success("Permission removed successfully");
      fetchRoles(); // Refresh the roles list to reflect the deletion
    } catch (error) {
      message.error("Failed to remove permission");
      console.error("Error removing permission:", error);
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
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions, record) => (
        <ul>
          {permissions.map((permission) => (
            <li key={permission.permissionID || permission.permissionName}>
              {permission.permissionName}
              <Button
                type="danger"
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() =>
                  handleDeletePermission(
                    record.roleID,
                    permission.permissionName
                  )
                }
                style={{ marginLeft: 8 }}
              />
            </li>
          ))}
        </ul>
      ),
    },
   
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
        title="নতুন ভূমিকা(Role) যোগ করুন"
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
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="parmissions"
            rules={[
              {
                required: true,
                message: "Please select at least one permission",
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Select permissions"
              value={selectedPermissions}
              onChange={setSelectedPermissions}
            >
              {permissions.map((permission) => (
                <Select.Option
                  key={permission.permissionName}
                  value={permission.permissionName}
                >
                  {permission.permissionName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default UserRolePage;
