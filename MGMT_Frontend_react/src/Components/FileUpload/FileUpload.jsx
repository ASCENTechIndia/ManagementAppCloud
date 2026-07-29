

import React, { useState } from "react";
import { useFormikContext } from "formik";
import "./FileUpload.css";
import { X } from "lucide-react";

const FileUpload = ({ disabled, name = "file", multiple = false ,onChange,accept = "image/png, image/jpeg, application/pdf", validateFile}) => {
  const formik = useFormikContext();
  const { setFieldValue } = formik;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);  
 const showError =
  hasInteracted || formik.submitCount > 0; 

 const handleFileChange = (event) => {
  const files = Array.from(event.target.files);

  if (files.length > 0) {
    let validFiles = files;

    // ✅ Validate files if validation function is provided
    if (validateFile) {
      validFiles = files.filter((file) => {
        const error = validateFile(file);
        if (error) alert(error);
        return !error;
      });
    }

    if (validFiles.length === 0) {
      event.target.value = ""; // Reset input
      return;
    }

    setSelectedFiles(validFiles);
    setFieldValue(name, multiple ? validFiles : validFiles[0]);
    setHasInteracted(true);

    // ✅ Call the onChange prop if it's provided
    if (onChange) {
      onChange(multiple ? validFiles : validFiles[0]);
    }

    event.target.value = ""; // Clear the input for re-selection
  }
};

  const handleFileRemove = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFieldValue(
      name,
      updatedFiles.length ? (multiple ? updatedFiles : updatedFiles[0]) : ""
    );
    setHasInteracted(true); 
    if (updatedFiles.length === 0) setFieldError(name, "File is required"); // ✅ Show error if all files are removed
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-box">
        <label className="upload-button">
          Choose {multiple ? "Files" : "File"}
          <input
            type="file"
             accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden-input"
            disabled={disabled}
          />
        </label>
      </div>

     {selectedFiles.length > 0 ? (
  <div className="file-info-container">
    {selectedFiles.map((file, index) => (
      <div key={index} className="file-item">
        <span className="file-name">
          {typeof file === "string" ? file : file.name}
        </span>
        <X
          className="cancel-icon"
          onClick={() => handleFileRemove(index)}
        />
      </div>
    ))}
  </div>
) : (
  // ✅ Show static filename if string present in Formik value
  formik.values[name] && typeof formik.values[name] === "string" ? (
    <div className="file-info-container">
      <div className="file-item">
        <span className="file-name">{formik.values[name]}</span>
      </div>
    </div>
  ) : (
    <span className="no-file-text">No file chosen</span>
  )
)}

      {/* Show error only if field is touched and has an error */}
{showError  && formik.errors[name] && (
        <div className="text-danger">{formik.errors[name]}</div>
      )}    </div>
  );
};

export default FileUpload;
