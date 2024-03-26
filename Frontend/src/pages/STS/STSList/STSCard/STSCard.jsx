import React from 'react';
import { Card, Space } from 'antd';
import { useLocation } from 'react-router-dom';
import './STSCard.css'; // Make sure the path matches your file structure

const STSCard = () => {
  const location = useLocation();
  const { sts } = location.state;

  return (
    <div className="card-container">
      <Space direction="vertical" size={16}>
        <Card
          className="card"
          title={`STS ID: ${sts.stsID}`}
          style={{
            width: 300,
          }}
        >
          <div className="card-content">
            <div className="card-title">STS Details</div>
            <p className="card-info">Ward Number: {sts.wardNumber}</p>
            <p className="card-info">Capacity: {sts.capacity}</p>
            <p className="card-info">Volume of Waste: {sts.volumeOfWaste}</p>
            <p className="card-info">Latitude: {sts.latitude}</p>
            <p className="card-info">Longitude: {sts.longitude}</p>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default STSCard;
