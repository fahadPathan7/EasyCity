import React from "react";
import landingAiLogo from "../../assets/images/AITruckImage.jpeg";
import landingLogo from "../../assets/images/DNCC_logo.png";
import anotherLogo from "../../assets/images/Econsync1.png"; // Import your new logo image
import DarkButton from "../../components/darkButton/DarkButton";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
      <div className="landingPageCanvas">
        <div className="landingAiLogo">
          <img
            src={landingAiLogo}
            alt="AITruckImage"
            className="landingAiLogo"
          />
        </div>
        <div className="LandingPageRight">
          <div className="paddingUpLanding"></div>
          <div>
            <img src={landingLogo} alt="DNCC Logo" className="LandingLogo" />
            {/* Add the new logo here */}
            <img src={anotherLogo} alt="Another Logo" className="LandingLogo" />
          </div>
          <div className="landingLogoSpacing"></div>
          <div className="landingPageTitle">
            ঢাকা উত্তর সিটি কর্পোরেশনে আপনাকে স্বাগতম
          </div>
          <div className="landingTitleSpacing"></div>

          <div className="landingPageButtonContainer">
            <DarkButton
              buttonText="প্রবেশ করুন"
              onClick={() => {}}
              routePath="/login"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
