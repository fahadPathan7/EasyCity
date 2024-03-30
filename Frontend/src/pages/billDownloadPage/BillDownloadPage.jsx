import DarkButton from "../../components/darkButton/DarkButton";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import billImg from "../../assets/images/billLogo.png";

import "./BillDownloadPage.css";
import NavBar from "../../components/navBar/NavBar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BillPDF from "../../components/PdfGenerator/BillPDF";

export default function BillDownloadPage() {
  const navigate = useNavigate();
  //const billData = useLocation().state?.newFirmInfo;
  const billID = useLocation().state?.billID;
  console.log("Fetching bill with ID:", billID);
  const billNo = billID;
  //console.log(billID);
  return (
    <>
      <NavBar />
      <div className="billdownloadpage-canvas">
        <div className="billdownloadpage-main-section">
          <div className="billdownload1">অভিনন্দন!</div>
          <div className="billdownload2">
            <img src={billImg} className="billdownload2" alt="" />
          </div>
          <div className="billdownload3">আপনার বিল তৈরি সম্পন্ন হয়েছে!</div>
          <div className="billdownload4">
            বিলটি ডাউনলোড করতে নিচের বাটনে ক্লিক করবেন
          </div>

          <PDFDownloadLink
            document={<BillPDF billID={billNo} />}
            fileName="বিল.pdf"
          >
            {({ loading }) =>
              loading ? (
                "লোডিং..."
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "80vw",
                  }}
                >
                  <DarkButton
                    buttonText="ডাউনলোড করুন"
                    onClick={() => {
                      setTimeout(() => {
                        navigate("/showBillPage", {
                          state: { billID: billNo },
                        });
                      }, 2000); // 2000 milliseconds delay
                    }}
                    routePath="forbidden"
                  />
                </div>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </>
  );
}
