import BackButton from "../../../components/backButton/BackButton";
import NavBar from "../../../components/navBar/NavBar";
import AddNewVehicleForm from "./AddNewVehicleForm";
import "./AddNewVehicle.css";

export default function AddNewVehicle() {
  return (
    <>
      <NavBar />
      <div className="addnewfirm-canvas">
        <div className="addnewfirm-title">
          <BackButton /> &nbsp;&nbsp; Vehicle তথ্যসমূহ দিন
        </div>
        <AddNewVehicleForm />
      </div>
    </>
  );
}
