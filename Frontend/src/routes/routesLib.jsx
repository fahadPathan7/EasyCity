import React from "react";
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
import Homepage from "../pages/homePage/HomePage";
import DashBoard from "../pages/dashBoard/DashBoard";
import ProgramList from "../pages/program/programList/ProgramList";
import AddNewProgram from "../pages/program/addNewProgram/AddNewProgram";
import AddReveingInfo from "../pages/addReceivingInfo/AddRecievingInfo";
import AddInvoiceInfoOfLandfillManager from "../pages/addInvoiceInfo/addInvoiceInfoOfLandfillManager/addInvoiceInfoOfLandfillManager";
import AddInvoiceInfoOfSTSManager from "../pages/addInvoiceInfo/addInvoiceInfoOfSTSManager/addInvoiceInfoOfSTSManager";

import ProtectedRoute from "./ProtectedRoute";
import InvoiceInfoListOfLandfillManager from "../pages/addInvoiceInfo/addInvoiceInfoOfLandfillManager/invoiceInfoListOfLandfillManager";
import InvoiceInfoOfSTSManagerForm from "../pages/addInvoiceInfo/addInvoiceInfoOfSTSManager/invoiceInfoListOfSTSManager";
import InvoiceInfoOfSTSManager from "../pages/addInvoiceInfo/addInvoiceInfoOfSTSManager/addInvoiceInfoOfSTSManager"
import CurrentDutySTS from "../pages/currentDuty/currentDutySTS/CurrentDutySTS";
import CurrentDutyLandfill from "../pages/currentDuty/curremtDutyLandfill/CurrentDutyLandfill";
import ShowBillPage from "../pages/billPage/showBillPage/ShowBillPage";
import BillList from "../pages/billPage/billList/BillList";
import BillCard from "../pages/billPage/billCard/BillCard";

const RoutesLib = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*Public Routes */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/billList" element={<BillList />} />
        <Route path="/billList/:billID" element={<BillCard />} />
        <Route path="/showBill" element={<ShowBillPage />} />
        <Route path="/invoiceInfoListOfLandfillManager" element={<InvoiceInfoListOfLandfillManager />} />
        <Route path="/invoiceInfoListOfSTSManager" element={<InvoiceInfoOfSTSManager />} />
        <Route path="/invoiceInfoOfSTSManagerForm" element={<InvoiceInfoOfSTSManagerForm />} />
        <Route path="/currentDutySTS" element={<CurrentDutySTS />} />
        <Route path="/currentDutyLandfill" element={<CurrentDutyLandfill />} />

        {/*Protected Routes */}

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              component={DashBoard}
              roles={[
                "System Admin",
                "Landfill Manager",
                "STS Manager",
                "Unassigned",
              ]}
            />
          }
        />
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute
              component={UserProfilePage}
              roles={[
                "System Admin",
                "STS Manager",
                "Landfill Manager",
                "Unassigned",
              ]}
            />
          }
        />
        <Route
          path="/userList"
          element={
            <ProtectedRoute component={UserListPage} roles={["System Admin"]} />
          }
        />
        <Route
          path="/userRoles"
          element={
            <ProtectedRoute
              component={UserRolesPage}
              roles={["System Admin"]}
            />
          }
        />
        <Route
          path="/programList"
          element={
            <ProtectedRoute
              component={ProgramList}
              roles={[
                "System Admin",
                "STS Manager",
                "Landfill Manager",
                "Unassigned",
              ]}
            />
          }
        />
        <Route
          path="/addInvoiceInfoOfSTSManager"
          element={
            <ProtectedRoute
              component={AddInvoiceInfoOfSTSManager}
              roles={["STS Manager"]}
            />
          }
        />
        <Route
          path="/addInvoiceInfoOfLandfillManager"
          element={
            <ProtectedRoute
              component={AddInvoiceInfoOfLandfillManager}
              roles={["Landfill Manager"]}
            />
          }
        />
        <Route
          path="/addReceivingInfo"
          element={
            <ProtectedRoute
              component={AddReveingInfo}
              roles={[
                "System Admin",
                "STS Manager",
                "Landfill Manager",
                "Unassigned",
              ]}
            />
          }
        />
        <Route
          path="/addNewProgram"
          element={
            <ProtectedRoute
              component={AddNewProgram}
              roles={["System Admin"]}
            />
          }
        />
        <Route
          path="/STSList"
          element={
            <ProtectedRoute component={STSList} roles={["System Admin"]} />
          }
        />
        <Route
          path="/sts/:stsID"
          element={
            <ProtectedRoute component={STSCard} roles={["System Admin"]} />
          }
        />
        <Route
          path="/addNewSTS"
          element={
            <ProtectedRoute component={AddNewSTS} roles={["System Admin"]} />
          }
        />
        <Route
          path="/landfillList"
          element={
            <ProtectedRoute component={LandfillList} roles={["System Admin"]} />
          }
        />
        <Route
          path="/addNewLandfill"
          element={
            <ProtectedRoute
              component={AddNewLandfill}
              roles={["System Admin"]}
            />
          }
        />
        <Route
          path="/vehicleList"
          element={
            <ProtectedRoute
              component={VehicleList}
              roles={[
                "System Admin",
                "STS Manager",
                "Landfill Manager",
                "Unassigned",
              ]}
            />
          }
        />
        <Route
          path="/addNewVehicle"
          element={
            <ProtectedRoute
              component={AddNewVehicle}
              roles={["System Admin"]}
            />
          }
        />
        <Route
          path="/landfill/:landfillID"
          element={
            <ProtectedRoute component={LandFillCard} roles={["System Admin"]} />
          }
        />
        <Route
          path="/vehicle/:vehicleNumber"
          element={
            <ProtectedRoute
              component={VehicleCard}
              roles={[
                "System Admin",
                "STS Manager",
                "Landfill Manager",
                "Unassigned",
              ]}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesLib;