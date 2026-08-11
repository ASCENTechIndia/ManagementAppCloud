import { useState } from "react";
import CustomAlert from "./CustomAlert";

const useAlert = () => {
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "info",
        duration: 3000,
    });

    const showAlert = (message, type = "info", duration = 3000) => {
        // console.log("SHOW ALERT:", message, type);

        setAlert({
            show: true,
            message,
            type,
            duration,
        });
    };

    const hideAlert = () => {
        setAlert({
            show: false,
            message: "",
            type: "info",
            duration: 3000,
        });
    };

    const Alert = () => {
        if (!alert.show) {
            return null;
        }

        return (
            <CustomAlert
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />
        );
    };

    return {
        showAlert,
        hideAlert,
        Alert,
    };
};

export default useAlert;