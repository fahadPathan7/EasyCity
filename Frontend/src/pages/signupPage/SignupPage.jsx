import DarkButton from "../../components/darkButton/DarkButton";
import landingLogo from "../../assets/images/DNCC_logo.png";
import SignUpForm from "./SignupForm";

import "./SignupPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="signupCanvas">
        <div className="signupCard">
          <div className="signUpCardHeader">
            <div className="signupLogo">
              <img className="signupLogo" src={landingLogo} alt="App Logo" />
            </div>
            <span className="signUpHeaderTitle">আপনার তথ্যসমূহ দিন</span>
          </div>
          <SignUpForm />
          <div className="signupFooter">
            পূর্বেই এক্যাউন্ট রয়েছে?{" "}
            <span
              className="signupFooterButton"
              onClick={() => {
                navigate("/login");
              }}
            >
              প্রবেশ করুন
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
