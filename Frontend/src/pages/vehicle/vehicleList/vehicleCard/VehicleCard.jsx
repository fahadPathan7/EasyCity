import React, { useEffect, useState } from "react";
import { Card, Space, List } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./VehicleCard.css";

const VehicleCard = () => {
  const location = useLocation();
  const vehicle = location.state.vehicle; // Adjust according to how the state is passed

  return (
    <div className="card-container">
      <Space direction="vertical" size={16}>
        <Card
          title={`Vehicle Number: ${vehicle.vehicleNumber}`}
          style={{ width: 300 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={[
              { title: "Type", description: vehicle.type },
              { title: "Capacity", description: `${vehicle.capacity} tons` },
              {
                title: "Fully Loaded Cost",
                description: `${vehicle.fullyLoadedCost}`,
              },
              {
                title: "Unloaded Cost",
                description: `${vehicle.unloadedCost}`,
              },
              // Any other vehicle details you wish to display
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
        </Card>
      </Space>
    </div>
  );
};

export default VehicleCard;
