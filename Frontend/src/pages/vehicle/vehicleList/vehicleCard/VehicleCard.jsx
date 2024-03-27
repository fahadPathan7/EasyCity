import React, { useEffect, useState } from 'react';
import { Card, Space, List, Select } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './STSCard.css';

const { Option } = Select;

const VehicleCard = () => {
  const location = useLocation();
  const { vehicle } = location.state;
  const [assignedManagers, setAssignedManagers] = useState(vehicle.vehicleManagers || []);
  const [unassignedManagers, setUnassignedManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initially check if there are already assigned managers
    if (!assignedManagers.length) {
      setLoading(true);
      axios.get('http://localhost:3000/vehicle/unassigned-managers')
        .then(response => {
          if (response.status === 200 && response.data.unassignedStsManagers) {
            // Correcting the variable to match the correct response structure
            setUnassignedManagers(response.data.unassignedStsManagers);
            console.log("asche")
            console.log(response.data.unassignedStsManagers);
          }
        })
        .catch(error => {
          console.error('Failed to fetch unassigned managers:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []); // This ensures the effect is re-run if the assigned managers list changes

  const handleManagerChange = (selectedManagerID) => {
    // When a new manager is selected, update the list of assigned managers and remove the selected one from unassigned
    const selectedManager = unassignedManagers.find(manager => manager.userID === selectedManagerID);
    if (selectedManager) {
      setAssignedManagers(prevManagers => [...prevManagers, selectedManager]);
      setUnassignedManagers(prevUnassigned => prevUnassigned.filter(manager => manager.userID !== selectedManagerID));
    }
  };

  return (
    <div className="card-container">
      <Space direction="vertical" size={16}>
        <Card
          className="card"
          title={`STS ID: ${vehicle.vehicleID}`}
          style={{ width: 300 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={[
              { title: 'Ward Number', description: vehicle.wardNumber },
              { title: 'Capacity', description: vehicle.capacity },
              { title: 'Volume of Waste', description: vehicle.volumeOfWaste },
              { title: 'Latitude', description: vehicle.latitude },
              { title: 'Longitude', description: vehicle.longitude },
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
          <strong>Assigned Managers:</strong>
          {assignedManagers.length > 0 ? (
            assignedManagers.map(manager => <div key={manager.userID}>{manager.name}</div>)
          ) : (
            'No one still assigned'
          )}
          {!loading && (
            <Select
              showSearch
              style={{ width: '100%', marginTop: '20px' }}
              placeholder="Select a manager"
              optionFilterProp="children"
              onChange={handleManagerChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {unassignedManagers.map(manager => (
                <Option key={manager.userID} value={manager.userID}>{manager.name}</Option>
              ))}
            </Select>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default VehicleCard;
