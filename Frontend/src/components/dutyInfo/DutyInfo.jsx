import "./DutyInfo.css";
// eslint-disable-next-line react/prop-types
export default function FirmInfo({ vehicleNumber, timeOfDepartureSts, landfillID }) {
  return (
    <>
      <div className="firm-info-wrapper">
        <div className="fi-firm-name">{vehicleNumber}</div>
        <div className="fi-firm-address">{landfillID}</div>
        <div className="fi-proprietor">ছাড়ার সময়: {timeOfDepartureSts}</div>
      </div>
    </>
  );
}