import { useNavigate } from "react-router-dom";
import "./RecentProgramInfoCard.css";

export default function RecentProgramInfoCard({
  programNo,
  programDate,
  sendingPoint,
  receivingPoint,
  sendingNetSlack,
  sendingDate,
  status,
  commodity,
  invoiceNo,
  route,
}) {
  const navigate = useNavigate();
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  sendingDate = new Date(sendingDate).toLocaleDateString("bn-BD", options);
  programDate = new Date(programDate).toLocaleDateString("bn-BD", options);

  const getStatusText = {
    1: 'প্রেরিত',
    2: 'প্রাপ্ত',
    3: 'বিল করা হয়েছে',
    4: 'বিল শেষ',
  };

  return (
    <>
      <div
        className="recent-program-card"
        onClick={() => {
          route ? navigate(route) : navigate("/program/" + invoiceNo);
        }}
      >
        <div className="recent-program-card-header">
          <div className="recent-program-card-header-left">
            ইনভয়েস নংঃ &nbsp;{" "}
            <span className="program-no-style">{invoiceNo}</span>
          </div>
          <div className="recent-program-card-header-right">{programDate}</div>
        </div>
        <div className="recent-program-card-title">
          {sendingPoint} - {receivingPoint}
        </div>
        <div className="recent-program-card-footer">
          <div className="recent-program-card-footer-left">
            <b>{commodity}</b> - &nbsp; <i>{sendingNetSlack} বস্তা</i>
            <br /> <b>প্রেরনঃ</b> &nbsp; {sendingDate}{" "}
          </div>
          <div className="recent-program-card-footer-right">{getStatusText[status]}</div>
        </div>
      </div>
    </>
  );
}