import BackButton from "../../../components/backButton/BackButton";
import NavBar from "../../../components/navBar/NavBar";
import AddNewInvoiceFrom from "./addInvoiceInfoOfLandfillManagerForm";
import "./addInvoiceInfoOfLandfillManager.css";
import { useLocation } from "react-router-dom";

export default function AddNewInvoiceInfoOfLandfillManager() {    

    //console.log(useLocation().state);

    return <>
        <NavBar />
        <div className="addnewprogram-canvas">
            <div className="addnewprogram-title-invoicepage">
                <BackButton />  ইনভয়েস এর তথ্যসমূহ দিন
            </div>
            <AddNewInvoiceFrom />
        </div>
    </>;
}