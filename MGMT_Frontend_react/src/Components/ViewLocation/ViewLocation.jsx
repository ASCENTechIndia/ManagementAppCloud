// components/ViewLocation.js

import React from "react";
import { useFormikContext } from "formik";

const ViewLocation = ({ latField = "latitude", lngField = "longitude" }) => {
  const { values } = useFormikContext();
  const latitude = values[latField];
  const longitude = values[lngField];

  const isValidCoords = latitude && longitude;
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <a
      href={isValidCoords ? mapUrl : "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: "14px",
        color: isValidCoords ? "#0d6efd" : "#999",
        textDecoration: "underline",
        pointerEvents: isValidCoords ? "auto" : "none",
      }}
      onClick={(e) => {
        if (!isValidCoords) e.preventDefault();
      }}
    >
      View Location
    </a>
  );
};

export default ViewLocation;
