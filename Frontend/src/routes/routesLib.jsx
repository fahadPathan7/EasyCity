import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingPage/LandingPage";
import LoginPage from "../pages/loginPage/LoginPage";
import SignupPage from "../pages/signupPage/SignupPage";
import UserProfilePage from "../pages/userProfilePage/UserProfilePage";
import UserListPage from "../pages/userListPage/UserListPage";
import UserRolesPage from "../pages/userRolesPage/UserRolesPage";
import STSList from "../pages/STS/STSList/STSList";
import AddNewSTS from "../pages/STS/addNewSTS/AddNewSTS";
import LandfillList from "../pages/landfill/landfillList/LandfillList";
import STSCard from "../pages/STS/STSList/STSCard/STSCard";
import AddNewLandfill from "../pages/landfill/addNewLandfill/AddNewLandfill";
import VehicleList from "../pages/vehicle/vehicleList/VehicleList";
import AddNewVehicle from "../pages/vehicle/addNewVehicle/AddNewVehicle";
import LandFillCard from "../pages/landfill/landfillList/landFillCard/LandFillCard";
import VehicleCard from "../pages/vehicle/vehicleList/vehicleCard/VehicleCard";
import Homepage from '../pages/homePage/HomePage';
import DashBoard from "../pages/dashBoard/DashBoard";
import ProgramList from "../pages/program/programList/ProgramList";
import AddNewProgram from "../pages/program/addNewProgram/AddNewProgram";
import AddReveingInfo from "../pages/addReceivingInfo/AddRecievingInfo";
import AddInvoiceInfoOfLandfillManager from '../pages/addInvoiceInfo/addInvoiceInfoOfLandfillManager/addInvoiceInfoOfLandfillManager';
import AddInvoiceInfoOfSTSManager from "../pages/addInvoiceInfo/addInvoiceInfoOfSTSManager/addInvoiceInfoOfSTSManager";

const RoutesLib = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/userProfile" element={<UserProfilePage />} />
          <Route path="/userList" element={<UserListPage />} />
          <Route path="/userRoles" element={<UserRolesPage />} />
          <Route path="/programList" element={<ProgramList />} />
          <Route path="/addInvoiceInfoOfSTSManager" element={<AddInvoiceInfoOfSTSManager />} />
          <Route path="/addInvoiceInfoOfLandfillManager" element={<AddInvoiceInfoOfLandfillManager />} />
          <Route path="/addReceivingInfo" element={<AddReveingInfo />} />
          <Route path="/addNewProgram" element={<AddNewProgram />} />
          <Route path="/STSList" element={<STSList />} />
          <Route path="/sts/:stsID" element={<STSCard />} />
          <Route path="/addNewSTS" element={<AddNewSTS />} />
          <Route path="/landfillList" element={<LandfillList />} />
          <Route path="/addNewLandfill" element={<AddNewLandfill />} />
          <Route path="/vehicleList" element={<VehicleList />} />
          <Route path="/addNewVehicle" element={<AddNewVehicle />} />
          <Route path="/landfill/:landfillID" element={<LandFillCard />} />
          <Route path="/vehicle/:vehicleNumber" element={<VehicleCard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RoutesLib;
