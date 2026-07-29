import React from "react";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A simple component to display a logo within a given boundary.
 *
 * @param {string} src The URL of the logo image.
 * @returns {JSX.Element} A <div> containing the logo image, or null if no src is provided.
 */
/*******  6a0b71f4-ebd9-4685-b48e-37065c842471  *******/ const NavbarLogo = ({
  src,
}) => {
  if (!src) return null; // Do not render if no logo URL is available

  const logoStyle = {
    width: "100px", // Adjust the size as needed
    height: "auto", // Maintain aspect ratio
    overflow: "hidden", // Ensure it stays within the boundary
  };

  const imageStyle = {
    width: "100%", // Make sure the image fits within the container
    height: "auto", // Maintain aspect ratio
  };
  return (
    <div style={logoStyle}>
      {" "}
      <img src={src} alt="Logo" style={imageStyle} />
    </div>
  );
};

export default NavbarLogo;
