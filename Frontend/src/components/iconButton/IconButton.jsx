/* eslint-disable react/prop-types */
import "./IconButton.css";
import MailButton from '@mui/icons-material/Email';
import HomeButton from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

export default function IconButton({buttonText, iconName, url}) {

    var ButtonName;

    if(iconName == "mail") ButtonName = MailButton;
    else ButtonName = HomeButton;

    return <>
       <Link to={url}>
        <div className="icon-button-canvas">
            <div className="icon-button-left"><ButtonName fontSize="large" /> &nbsp;&nbsp;</div>
            <div className="icon-button-right">{buttonText}</div>
        </div>
        </Link>
    </>;

}