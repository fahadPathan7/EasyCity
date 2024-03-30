import "./LoginPage.css";

import landingAiLogo from "../../assets/images/loginPageLogo.jpeg";
import AppLogo from "../../assets/images/DNCC_logo.png";
import LoginForm from "./LoginForm";
import loginPhoto from "../../assets/images/-seven-workers-diligently-collect-compacted-garbage-from-twin-small-trucks-under-a-warm-sunny-atmos.jpeg"

import { useState } from "react";
import ForgetPasswordModal from "./ForgotPasswordModel";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="loginPageRoot">
        <ForgetPasswordModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <div className="loginLeft">
          <img
            src={landingAiLogo} 
            alt="Description of the image"
            className="loginLogoWrapper"
          />
        </div>
        <div className="loginRight">
          <div></div>
          <div>
            <img
              src={AppLogo}
              alt="Description of the image"
              className="AppLoginLogo"
            />
          </div>
          
          <LoginForm />
          <div className="login-forgot-password">
            পাসওয়ার্ড ভুলে গেছেন? এখানে{" "}
            <b
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              ক্লিক করুন
            </b>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
