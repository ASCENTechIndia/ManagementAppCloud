const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

const swm = async (req, res) => {
    let connection;
    try {

        res.json({ success: true, data: "OPD" });

    } catch (error) {
        console.error("Error fetching:", error);
        res.status(500).json({ success: false, message: "Error fetching" });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing Oracle connection:", err);
            }
        }
    }
};

// Export `swm` to match the routes that import `{ swm }`.
// Keep `mgmt` as a backwards-compatible alias.
module.exports = { swm, mgmt: swm };
