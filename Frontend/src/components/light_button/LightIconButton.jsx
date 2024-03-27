/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./LightIconButton.css";

function LightIconButton(props) {
  const {
    buttonText,
    onClick,
    routePath,
    IconComponent,
    type = "button",
  } = props;

  if (routePath === "forbidden") {
    return (
      <>
        <div>
          <button onClick={onClick} type={type} className="light-btn">
            <IconComponent className="lb-icon" />
            {buttonText}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div>        
        <Link to={routePath}>
          <button onClick={onClick} type={type} className="light-btn">
            <IconComponent className="lb-icon" />
            {buttonText}
          </button>
        </Link>
      </div>
    </>
  );
}

export default LightIconButton;