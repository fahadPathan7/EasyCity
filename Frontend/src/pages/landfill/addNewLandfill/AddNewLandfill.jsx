import BackButton from "../../../components/backButton/BackButton";
import NavBar from "../../../components/navBar/NavBar";
import AddNewSTSForm from "./AddNewLandfillForm";
import "./AddNewLandfill.css";

export default function AddNewLandfill() {
  return (
    <>
      <NavBar />
      <div className="addnewfirm-canvas">
        <div className="addnewfirm-title">
          <BackButton /> &nbsp;&nbsp; 
          Landfill তথ্যসমূহ দিন
        </div>
        < AddNewSTSForm />
      </div>
    </>
  );
};