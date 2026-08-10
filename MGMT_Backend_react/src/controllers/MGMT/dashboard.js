const oracledb = require('oracledb');
const { getConnection } = require('../../config/database');

// crm dashboard
const getComplaintSources = async (req, res) => {
  let connection;
  try {
    const { ulbid, startDate, endDate } = req.body;

    if (!ulbid || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "ulbid, startDate and endDate are required",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'W'  THEN 1 END) AS Web,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'GR' THEN 1 END) AS GRC,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'M'  THEN 1 END) AS Mobile,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'PG' THEN 1 END) AS PG_Portal,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'ZR' THEN 1 END) AS Z_Reference,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'EM' THEN 1 END) AS E_Mail,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'A'  THEN 1 END) AS Aple_Sarkar,
        COUNT(CASE WHEN UPPER(VAR_COMPLNT_SOURCE) = 'C'  THEN 1 END) AS Disaster_Management,
        COUNT(*) AS Total
      FROM crm.aomcm_complaintmast_def
      WHERE num_complaintmast_ulbid = :ulbid
        AND dat_complnt_insdate BETWEEN TO_DATE(:startDate,'yyyy-mm-dd') 
                                    AND TO_DATE(:endDate,'yyyy-mm-dd')
    `;

    const result = await connection.execute(
      query,
      { ulbid, startDate, endDate },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching Complaint Sources:", error);
    res.status(500).json({ success: false, message: "Error fetching Complaint Sources" });
  } finally {
    if (connection) await connection.close();
  }
};


// 2️⃣ Complaint Status
const getComplaintStatuses = async (req, res) => {
  let connection;
  try {
    const { ulbid, startDate, endDate } = req.body;

    if (!ulbid || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "ulbid, startDate and endDate are required",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        COUNT(CASE WHEN UPPER(var_complnt_currentstatus) = 'CL' THEN 1 END) AS Close_,
        COUNT(CASE WHEN UPPER(var_complnt_currentstatus) = 'WA' THEN 1 END) AS Work_Assigned,
        COUNT(CASE WHEN UPPER(var_complnt_currentstatus) = 'PA' THEN 1 END) AS Pending_For_Authentication,
        COUNT(CASE WHEN UPPER(var_complnt_currentstatus) = 'UP' THEN 1 END) AS Pending_For_Assign
      FROM crm.aomcm_complaintmast_def
      WHERE num_complaintmast_ulbid = :ulbid
        AND dat_complnt_cmplregdate BETWEEN TO_DATE(:startDate,'yyyy-mm-dd') 
                                        AND TO_DATE(:endDate,'yyyy-mm-dd')
    `;

    const result = await connection.execute(
      query,
      { ulbid, startDate, endDate },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching Complaint Statuses:", error);
    res.status(500).json({ success: false, message: "Error fetching Complaint Statuses" });
  } finally {
    if (connection) await connection.close();
  }
};


// 3️⃣ Resolution & Avg Time
const getResolutionSummary = async (req, res) => {
  let connection;
  try {
    const { ulbid, startDate, endDate } = req.body;

    if (!ulbid || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "ulbid, startDate and endDate are required",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        sum(total_application) AS total_complnt,
        sum(close) AS resolved,
        ROUND(AVG((closedate - dt) * 24), 2) AS avg_resolution_time_hrs
      FROM crm.view_analysismmcdtls_web
      WHERE ulbid = :ulbid
        AND TRUNC(dt) BETWEEN TO_DATE(:startDate,'yyyy-mm-dd') 
                                        AND TO_DATE(:endDate,'yyyy-mm-dd')
    `;

    const result = await connection.execute(
      query,
      { ulbid, startDate, endDate },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching Resolution Summary:", error);
    res.status(500).json({ success: false, message: "Error fetching Resolution Summary" });
  } finally {
    if (connection) await connection.close();
  }
};


const getMonthlyCSAT = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT  
          TO_CHAR(dat_complnt_cmplregdate, 'MON') AS month,
          ROUND((SUM((CM.date_complnt_closedate - CM.dat_complnt_cmplregdate) * 24) 
              / NULLIF(COUNT(CASE WHEN UPPER(CM.var_complnt_currentstatus) = 'CL' THEN 1 END), 0)), 2) AS CSAT,
          COUNT(CASE WHEN UPPER(var_complnt_currentstatus) = 'WA' THEN 1 END) AS Work_Assigned
      FROM crm.aomcm_complaintdetn_def CD 
      INNER JOIN crm.aomcm_complaintmast_def CM
        ON CD.var_cmltdet_cmplno = CM.var_complnt_cmplno
      GROUP BY TO_CHAR(dat_complnt_cmplregdate, 'MON')
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching Monthly CSAT:", error);
    res.status(500).json({ success: false, message: "Error fetching Monthly CSAT" });
  } finally {
    if (connection) await connection.close();
  }
};


// 2️⃣ Complaint Aging Buckets
const getComplaintAging = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT 
        CASE 
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) * 24 < 24 THEN '<24h'
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) BETWEEN 1 AND 3 THEN '1-3d'
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) BETWEEN 4 AND 7 THEN '4-7d'
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) > 7 THEN '>7d'
        END AS aging_bucket,
        COUNT(*) AS total_complaints
      FROM crm.aomcm_complaintmast_def
      WHERE UPPER(var_complnt_currentstatus) <> 'CL'
      GROUP BY 
        CASE 
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) * 24 < 24 THEN '<24h'
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) BETWEEN 1 AND 3 THEN '1-3d'
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) BETWEEN 4 AND 7 THEN '4-7d'
            WHEN (DATE_COMPLNT_CLOSEDATE - dat_complnt_cmplregdate) > 7 THEN '>7d'
        END
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching Complaint Aging:", error);
    res.status(500).json({ success: false, message: "Error fetching Complaint Aging" });
  } finally {
    if (connection) await connection.close();
  }
};


// 3️⃣ Monthly Complaint Resolved vs Total
const getMonthlyResolved = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT 
          TO_CHAR(dat_complnt_cmplregdate, 'MON') AS month,
          COUNT(CASE WHEN UPPER(var_complnt_currentstatus) = 'CL' THEN 1 END) AS resolved,
          COUNT(var_complnt_cmplno) AS total_complnt
      FROM crm.aomcm_complaintmast_def
      GROUP BY TO_CHAR(dat_complnt_cmplregdate, 'MON')
      ORDER BY month
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching Monthly Resolved:", error);
    res.status(500).json({ success: false, message: "Error fetching Monthly Resolved" });
  } finally {
    if (connection) await connection.close();
  }
};


const getAgentPerformance = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;

    if (!ulbid) {
      return res.status(400).json({
        success: false,
        message: "ulbid is required",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
          AD.var_user_username AS UserName,
          CM.VAR_COMPLNT_CHECKEDBY AS UserID,
          COUNT(CASE WHEN UPPER(CM.VAR_COMPLNT_CHECKEDSTATUS) = 'Y' THEN 1 END) AS Handled,
          ROUND(AVG((CM.date_complnt_closedate - CM.dat_complnt_cmplregdate) * 24), 2) AS avg_resolution_time_hrs,
          COUNT(CASE WHEN UPPER(CM.var_complnt_currentstatus) = 'CL' THEN 1 END) AS Close_,
          ROUND(
            (SUM((CM.date_complnt_closedate - CM.dat_complnt_cmplregdate) * 24) /
            NULLIF(COUNT(CASE WHEN UPPER(CM.var_complnt_currentstatus) = 'CL' THEN 1 END), 0)), 
          2) AS CSAT
      FROM 
          admins.aoma_user_def AD
      INNER JOIN 
          crm.aomcm_complaintdetn_def CD 
          ON AD.num_user_userid = CD.num_cmltdet_assgnuserid
      INNER JOIN 
          crm.aomcm_complaintmast_def CM
          ON CD.var_cmltdet_cmplno = CM.var_complnt_cmplno
      WHERE 
          num_user_ulbid = :ulbid
      GROUP BY 
          CM.VAR_COMPLNT_CHECKEDBY, AD.var_user_username
    `;

    const result = await connection.execute(
      query,
      { ulbid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching Agent Performance:", error);
    res.status(500).json({ success: false, message: "Error fetching Agent Performance" });
  } finally {
    if (connection) await connection.close();
  }
};

const getComplaintDetailsByUlb = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body; // ✅ Take ulbid from request body

    if (!ulbid) {
      return res.status(400).json({ success: false, message: "ulbid is required" });
    }

    connection = await getConnection();

    const query = `
      SELECT * 
      FROM crm.mview_rpt_complaint_details 
      WHERE ulbid = :ulbid
    `;

    const result = await connection.execute(
      query,
      { ulbid }, // ✅ bind parameter
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching ComplaintDetailsByUlb:", error);
    res.status(500).json({ success: false, message: "Error fetching ComplaintDetailsByUlb" });
  } finally {
    if (connection) await connection.close();
  }
};


module.exports = {

    getComplaintSources,
  getComplaintStatuses,
  getResolutionSummary,
   getMonthlyCSAT,
  getComplaintAging,
  getMonthlyResolved,
  getAgentPerformance,
  getComplaintDetailsByUlb,
  

};