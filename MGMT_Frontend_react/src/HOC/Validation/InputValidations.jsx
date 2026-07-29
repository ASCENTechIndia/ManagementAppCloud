export const inputHandlers = {
  name: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^[a-zA-Z\u0900-\u097F\u00C0-\u024F\u1E00-\u1EFF ]*$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },

  phone: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFieldValue(fieldName, value);
    }
  },

  integer: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^[\d.]*$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },

  onlyNumbers: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setFieldValue(fieldName, numericValue);
  },

  amount: (e, setFieldValue, fieldName) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }
    if (parts[1]?.length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }
    setFieldValue(fieldName, value);
  },
  aadhaar: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },
  noSpecialChar: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, "");
    setFieldValue(fieldName, cleaned);
  },

  vehicleno: (e, setFieldValue, fieldName) => {
    const value = e.target.value.toUpperCase();
    const cleaned = value.replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, "");
    if (cleaned.length <= 10) {
      setFieldValue(fieldName, cleaned);
    } else {
      setFieldValue(fieldName, cleaned.slice(0, 10));
    }
  },

  email: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    // Only allow valid email characters while typing
    if (/^[a-zA-Z0-9@._-]*$/.test(value)) {
      setFieldValue(fieldName, value);
    }
    // You can later validate format strictly in Yup schema or final validation
  },

  pan: (e, setFieldValue, fieldName) => {
    const value = e.target.value.toUpperCase(); // optional uppercase
    if (value.length <= 10) {
      setFieldValue(fieldName, value);
    }
  },

  chequeno: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    // Allow up to 6 digits only (no letters or special chars)
    if (/^\d{0,6}$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },

  micrcode: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    // Allow up to 9 digits only
    if (/^\d{0,9}$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },

  // GST: max 15 characters
  gst: (e, setFieldValue, fieldName) => {
    const value = e.target.value.toUpperCase(); // optional uppercase
    if (value.length <= 15) {
      setFieldValue(fieldName, value);
    }
  },
};
