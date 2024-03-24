import { Link } from "react-router-dom";
import "./DarkButton.css";
import PropTypes from "prop-types";

function DarkButton(props) {
const DarkButton = (props) => {
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
};

DarkButton.propTypes = {
    buttonText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    routePath: PropTypes.string.isRequired,
    type: PropTypes.string,
};

export default DarkButton;

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

export default DarkButton;