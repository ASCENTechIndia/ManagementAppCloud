const express = require("express");
const router = express.Router();
const { 
    getComplaintSources,getComplaintStatuses,getResolutionSummary,getMonthlyCSAT,
  getComplaintAging,
  getMonthlyResolved,getAgentPerformance,
  getComplaintDetailsByUlb,


} = require("../../controllers/MGMT/dashboard");


router.post("/GetComplaintSources", getComplaintSources);
router.post("/GetComplaintStatuses", getComplaintStatuses);
router.post("/GetResolutionSummary", getResolutionSummary);
router.post("/GetMonthlyCSAT", getMonthlyCSAT);
router.post("/GetComplaintAging", getComplaintAging);
router.post("/GetMonthlyResolved", getMonthlyResolved);
router.post("/GetAgentPerformance", getAgentPerformance);
router.post("/getComplaintDetailsByUlb", getComplaintDetailsByUlb);


module.exports = router;