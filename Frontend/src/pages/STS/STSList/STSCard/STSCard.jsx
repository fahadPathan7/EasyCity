import React, { useEffect, useState } from "react";
import { Card, Space, List, Select, message, Spin } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./STSCard.css"; // Ensure you've got the correct path to your CSS file
import { LoadingOutlined } from "@ant-design/icons";
import NavBar from "../../../../components/navBar/NavBar";

const { Option } = Select;

const STSCard = () => {
  const location = useLocation();
  const sts = location.state.sts;
  const [assignedManagers, setAssignedManagers] = useState(
    sts.stsManagers ? sts.stsManagers.filter((manager) => manager.userID) : []
  );
  const [unassignedManagers, setUnassignedManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/sts/unassigned-managers", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200 && response.data.unassignedStsManagers) {
          setUnassignedManagers(response.data.unassignedStsManagers);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch unassigned managers:", error);
        message.error("Failed to fetch unassigned managers.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assignedManagers.length]); // Re-run if the assigned managers list changes

  const handleManagerChange = async (selectedManagerID) => {
    // Ensure the selected manager ID is valid
    if (!selectedManagerID) {
      message.error("Invalid manager selected. Please try again.");
      return;
    }

    const selectedManager = unassignedManagers.find(
      (manager) => manager.userID === selectedManagerID
    );
    if (selectedManager) {
      // Filter out any null values and include the new manager ID
      const currentManagerIDs = assignedManagers
        .map((manager) => manager.userID)
        .filter((id) => id); // This removes any falsy values, including null or undefined

      const updatedManagerIDs = [...currentManagerIDs, selectedManagerID];

      try {
        const response = await axios.post(
          "http://localhost:3000/sts/add-sts-managers",
          {
            stsID: sts.stsID,
            stsManagers: updatedManagerIDs,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          // Update states based on the successful assignment
          setAssignedManagers((prev) => [...prev, selectedManager]);
          setUnassignedManagers((prev) =>
            prev.filter((manager) => manager.userID !== selectedManagerID)
          );
          message.success("STS managers assigned successfully.");
        }
      } catch (error) {
        console.error("Failed to assign manager:", error);
        message.error("Failed to assign manager. Please try again.");
      }
    } else {
      message.error("Manager not found in the unassigned list.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="card-container">
        <Space direction="vertical" size={16}>
          <Card className="card">
            <div className="card-title">STS ID: {sts.stsID}</div>
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: "Ward Number", description: sts.wardNumber },
                { title: "Capacity", description: sts.capacity },
                { title: "Volume of Waste", description: sts.volumeOfWaste },
                { title: "Latitude", description: sts.latitude },
                { title: "Longitude", description: sts.longitude },
              ]}
              renderItem={(item) => (
                <List.Item className="list-item">
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
            <div className="assigned-managers-title">Assigned Managers:</div>
            {loading ? (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            ) : assignedManagers.length > 0 ? (
              assignedManagers.map((manager) => (
                <div className="manager-item" key={manager.userID}>
                  {manager.name}
                </div>
              ))
            ) : (
              <div>No one still assigned</div>
            )}
            {!loading && (
              <Select
                showSearch
                style={{ width: "100%", marginTop: "20px" }}
                placeholder="Select a manager"
                optionFilterProp="children"
                onChange={handleManagerChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {unassignedManagers.map((manager) => (
                  <Option key={manager.userID} value={manager.userID}>
                    {manager.name}
                  </Option>
                ))}
              </Select>
            )}
          </Card>
        </Space>
      </div>
    </>
  );
};

export default STSCard;
