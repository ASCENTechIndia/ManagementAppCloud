import axios from "axios";

const logErrorToServer = async (error, componentName = "UnknownComponent") => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user.username || user.email || "Unknown User";

    await axios.post("http://43.205.160.198:5001/log-error", {
      errorMessage: error.message,
      stackTrace: error.stack || "No stack trace",
      component: componentName,
      user: username,
      requestUrl: window.location.href,
    });
  } catch (loggingError) {
    console.error("Failed to log error:", loggingError);
  }
};

export default logErrorToServer;
