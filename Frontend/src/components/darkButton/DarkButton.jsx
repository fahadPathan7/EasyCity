import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import "./DarkButton.css";

function DarkButton(props) {
  const { buttonText, onClick, routePath, type = "button" } = props;

  if (routePath === "forbidden") {
    return (
      <>
        <div>
          <button onClick={onClick} type={type} className="DarkButton">
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
          <button onClick={onClick} type={type} className="DarkButton">
            {buttonText}
          </button>
        </Link>
      </div>
    </>
  );
}

// Define PropTypes
DarkButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func, // Not marking as required assumes it's optional
  routePath: PropTypes.string,
  type: PropTypes.string,
};

export default DarkButton;
