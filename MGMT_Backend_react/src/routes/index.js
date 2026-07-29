
const express = require("express");
const router = express.Router();

const authRoutes = require("./Admin/authRoutes");
router.use("/", authRoutes); 

const logoroutes = require("./Admin/logoroutes");
router.use("/", logoroutes);

const logoutRoutes = require("./Admin/logoutRoutes.js");
router.use("/", logoutRoutes);

const menurouted=require("./Admin/menuRoutes.js");
router.use("/",menurouted);

// MGMT
const MGMT = require("./MGMT/mgmt.js");
router.use("/",MGMT);

const DashBoard = require("./MGMT/dashboard.js");
router.use("/",DashBoard);


// //Master
// const Master = require("./SWM/Master/index.js");
// router.use("/",Master);

// // //Transaction
// const Transaction = require("./SWM/Transaction/index.js");
// router.use("/",Transaction);

// const Report = require("./SWM/Reports/index.js");
// router.use("/",Report);


module.exports = router;
