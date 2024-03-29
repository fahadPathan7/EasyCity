import BackButton from "../../../components/backButton/BackButton"
import NavBar from "../../../components/navBar/NavBar";
import "./AddNewProgram.css";
import AddNewProgramForm from "./AddNewProgramForm";

export default function AddNewProgram() {
  return (
    <>
      <NavBar />
      <div className="addnewprogram-canvas">
        <div className="addnewprogram-title-addnewprogrampage">
          <BackButton /> <div> ট্রাকের তথ্যসমূহ দিন</div>
        </div>
        <AddNewProgramForm />
      </div>
    </>
  );
}
