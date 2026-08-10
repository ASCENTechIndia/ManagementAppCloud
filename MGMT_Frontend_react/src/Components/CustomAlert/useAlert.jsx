import { useState } from "react";
import CustomAlert from "./CustomAlert";

const useAlert = () => {
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "info",
    });

    const showAlert = (message, type = "info") => {
        console.log("SHOW ALERT:", message, type);

        setAlert({
            show: true,
            message,
            type,
        });
    };

    const hideAlert = () => {
        setAlert({
            show: false,
            message: "",
            type: "info",
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