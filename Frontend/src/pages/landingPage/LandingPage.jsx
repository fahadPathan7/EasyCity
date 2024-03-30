import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import landingAiLogo from "../../assets/images/AITruckImage.jpeg";
import landingLogo from "../../assets/images/DNCC_logo.png";
import DarkButton from "../../components/darkButton/DarkButton";
import "./LandingPage.css";
import { cookie } from "express-validator";

// Utility function to read a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateTokenAndRedirect = async () => {
      try {
        // Directly call the validate-token API without explicitly reading the cookie
        const response = await axios.get("/auth/validate-token", {
          withCredentials: true, // Important: to send the cookie with the request
        });

        // If the API call is successful, the token is valid
        if (response.status === 200) {
          navigate("/userProfile");
        }
      } catch (error) {
        console.error(
          "Authentication check failed or user not logged in",
          error
        );
        // No redirection, user stays on the landing page
      }
    };

    validateTokenAndRedirect();
  }, [navigate]);
  return (
    <>
      <div className="landingPageCanvas">
        <div className="landingAiLogo">
          <img
            src={landingAiLogo}
            alt="Description of the image"
            className="landingAiLogo"
          />
        </div>
        <div className="LandingPageRight">
          <div className="paddingUpLanding"></div>
          <div>
            <img
              src={landingLogo}
              alt="Description of the image"
              className="LandingLogo"
            />
          </div>
          <div className="landingLogoSpacing"></div>
          <div className="landingPageTitle">
            ঢাকা উত্তর সিটি কর্পোরেশনে আপনাকে স্বাগতম{" "}
          </div>
          <div className="landingTitleSpacing"></div>

          <div className="landingPageButtonContainer">
            <DarkButton
              buttonText="প্রবেশ করুন"
              onClick={() => {}}
              routePath="/login"
            />
            <DarkButton
              buttonText="নিবন্ধন করুন"
              onClick={() => {}}
              routePath="/signup"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

// const LandingPage = () => {
//     return (
//         <>
//             <div className="landingPageCanvas">
//                 <div className="landingAiLogo">
//                     <img
//                         src={landingAiLogo}
//                         alt="Description of the image"
//                         className="landingAiLogo"
//                     />
//                 </div>
//                 <div className="LandingPageRight">
//                     <div className="paddingUpLanding"></div>
//                     <div>
//                         <img
//                             src={landingLogo}
//                             alt="Description of the image"
//                             className="LandingLogo"
//                         />
//                     </div>
//                     <div className="landingLogoSpacing"></div>
//                     <div className="landingPageTitle">ঢাকা উত্তর সিটি কর্পোরেশনে আপনাকে স্বাগতম </div>
//                     <div className="landingTitleSpacing"></div>

//                     <div className="landingPageButtonContainer">
//                         <DarkButton
//                             buttonText="প্রবেশ করুন"
//                             onClick={() => {}}
//                             routePath="/login"
//                         />
//                         <DarkButton
//                             buttonText="নিবন্ধন করুন"
//                             onClick={() => {}}
//                             routePath="/signup"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default LandingPage;
