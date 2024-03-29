import React, { useEffect, useState } from "react";
import { Card, Space, List, Select, message } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./LandFillCard.css"; // Make sure this path matches your CSS file's location
import BackButton from "../../../../components/backButton/BackButton";

const { Option } = Select;

const LandfillCard = () => {
  const location = useLocation();
  const landfill = location.state.landfills; // Adjust based on how you're passing state
  const [assignedManagers, setAssignedManagers] = useState(
    landfill.landfillManagers ? landfill.landfillManagers.filter((manager) => manager.userID) : []
  );
  const [unassignedManagers, setUnassignedManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/landfill/unassigned-managers", {
        withCredentials: true,
      })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.unassignedLandfillManagers
        ) {
          setUnassignedManagers(response.data.unassignedLandfillManagers);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch unassigned managers:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleManagerChange = async (selectedManagerID) => {
    const selectedManager = unassignedManagers.find(
      (manager) => manager.userID === selectedManagerID
    );
    if (selectedManager) {
      // Ensure all current assignedManager IDs are valid and exclude any falsy values.
      const currentManagerIDs = assignedManagers
        .map((manager) => manager.userID)
        .filter((id) => id); // This filter removes falsy values, including null and undefined

      const updatedManagerIDs = [...currentManagerIDs, selectedManagerID];

      try {
        const response = await axios.post(
          "http://localhost:3000/landfill/add-landfill-managers",
          {
            landfillID: landfill.landfillID,
            landfillManagers: updatedManagerIDs,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          // Assuming the backend returns the updated list of assigned managers,
          // you might want to use the response to update the state.
          // For now, let's update the frontend state optimistically:
          setAssignedManagers((prev) => [...prev, selectedManager]);
          setUnassignedManagers((prev) =>
            prev.filter((manager) => manager.userID !== selectedManagerID)
          );
          message.success("Landfill managers assigned successfully.");
        }
      } catch (error) {
        console.error("Failed to assign manager:", error);
        message.error("Failed to assign manager. Please try again.");
      }
    }
  };

  return (
    <div className="card-container">
      <BackButton />
      <Space direction="vertical" size={16}>
        <Card
          title={`Landfill ID: ${landfill.landfillID}`}
          className="landfill-card"
          style={{ width: 300 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={[
              { title: "Name", description: landfill.name },
              {
                title: "Operational Timespan",
                description: landfill.operationalTimespan,
              },
              { title: "Volume of Waste", description: landfill.volumeOfWaste },
              { title: "Latitude", description: landfill.latitude },
              { title: "Longitude", description: landfill.longitude },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          <strong>Assigned Managers:</strong>
          {assignedManagers.length > 0
            ? assignedManagers.map((manager) => (
                <div key={manager.userID}>{manager.name}</div>
              ))
            : "No managers assigned yet."}
          {!loading && (
            <Select
              showSearch
              style={{ width: "100%", marginTop: "20px" }}
              placeholder="Select a manager to assign"
              onChange={handleManagerChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
  );
};

export default LandfillCard;
