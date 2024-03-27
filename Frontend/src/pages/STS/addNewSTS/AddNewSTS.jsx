import BackButton from "../../../components/backButton/BackButton";
import NavBar from "../../../components/navBar/NavBar";
import AddNewSTSForm from "./AddNewSTSForm";
import "./AddNewSTS.css";

export default function AddNewSTS() {
  return (
    <>
      <NavBar />
      <div className="addnewfirm-canvas">
        <div className="addnewfirm-title">
          <BackButton /> &nbsp;&nbsp; 
          STS তথ্যসমূহ দিন
        </div>
        < AddNewSTSForm />
      </div>
    </>
  );
}