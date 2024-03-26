import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingPage/LandingPage";
import LoginPage from "../pages/loginPage/LoginPage";
import SignupPage from "../pages/signupPage/SignupPage";
import UserProfilePage from "../pages/userProfilePage/UserProfilePage";
import UserListPage from "../pages/userListPage/UserListPage";
import UserRolesPage from '../pages/userRolesPage/UserRolesPage';

const RoutesLib = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/userProfile" element={<UserProfilePage />} />
          <Route path="/userList" element={<UserListPage />} />
          <Route path="/userRoles" element={<UserRolesPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RoutesLib;
