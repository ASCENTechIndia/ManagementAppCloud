import "./NavbarText.css";
import PropTypes from "prop-types";

const NavbarText = ({ text1, text2 ,className=""}) => {
  return (
    <div className="navbar-text">
      <span className={className}>{text1}</span>
      <span className={className}>{text2}</span>
    </div>
  );
};

NavbarText.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
};

export default NavbarText;
