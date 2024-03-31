// RecentVehicleInfoCard.jsx
import { useNavigate } from "react-router-dom";
import "./RecentProgramInfoCard.css"; // Ensure CSS is appropriately adjusted

export default function RecentVehicleInfoCard({
  vehicleNumber,
  type,
  capacity,
  stsID,
  landfillID,
  timeOfDepartureSts,
  route,
}) {
  const navigate = useNavigate();
  const departureTime = `Departure Time: ${timeOfDepartureSts} hours`;

  return (
    <>
      <div
        className="recent-vehicle-card"
        onClick={() => {
          route ? navigate(route) : navigate("/vehicle/" + vehicleNumber); // Adjust navigation as needed
        }}
      >
        <div className="recent-vehicle-card-header">
          Vehicle No: <span className="vehicle-no-style">{vehicleNumber}</span>
        </div>
        <div className="recent-vehicle-card-title">{type} - Capacity: {capacity} tons</div>
        <div className="recent-vehicle-card-footer">
          <div>{departureTime}</div>
          <div>Landfill ID: {landfillID}</div>
        </div>
      </div>
    </>
  );
}
