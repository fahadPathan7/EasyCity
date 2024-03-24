import landingAiLogo from "../../assets/images/AITruckImage.jpeg";
import landingLogo from "../../assets/images/DNCC_logo.png";
import DarkButton from "../../components/darkButton/DarkButton";
import "./LandingPage.css"
const LandingPage = () => {
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
                    <div className="landingPageTitle">ঢাকা উত্তর সিটি কর্পোরেশনে আপনাকে স্বাগতম </div>
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