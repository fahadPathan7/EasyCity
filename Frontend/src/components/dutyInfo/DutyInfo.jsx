import "./DutyInfo.css";
// eslint-disable-next-line react/prop-types
export default function FirmInfo({ firmName, firmAddress, ProprietorName }) {
  return (
    <>
      <div className="firm-info-wrapper">
        <div className="fi-firm-name">{firmName}</div>
        <div className="fi-firm-address">{firmAddress}</div>
        <div className="fi-proprietor">প্রোপ্রাইটর: {ProprietorName}</div>
      </div>
    </>
  );
}