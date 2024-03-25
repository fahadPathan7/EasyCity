import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, message } from "antd";

const UserListPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllUsers();
    //eslint-disable-next-line
  }, []);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });
      setUsersData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:3000/profile/deleteUser",
        { itemId: record._id },
        { withCredentials: true }
      );
      message.success("Item Deleted Successfully");
      getAllUsers();
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
    { title: "RoleIDs", dataIndex: "roleIDs" },
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
      if (!editUser) {
        await axios.post("http://localhost:3000/profile/addUser", values, {
          withCredentials: true,
        });
        message.success("Item Added Successfully");
      } else {
        await axios.put(
          "http://localhost:3000/profile/editUser",
          { ...values, itemId: editUser._id },
          { withCredentials: true }
        );
        message.success("Item Updated Successfully");
      }
      getAllUsers();
      setPopupModal(false);
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div>Hello</div>
    </DefaultLayout>
  );
};

export default UserListPage;
