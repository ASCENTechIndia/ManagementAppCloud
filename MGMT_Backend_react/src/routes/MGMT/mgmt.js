
const express = require('express');
const router = express.Router();
const { swm } = require('../../../src/controllers/MGMT/mgmt.js');
const { GenericCall } = require('../../../src/controllers/MGMT/GenericCall.js');
const { WTGenericCall } = require('../../../src/controllers/MGMT/WTGenericCall.js');
router.post('/swm', swm);
router.post('/generic-call', GenericCall);
router.post('/WTgeneric-call', WTGenericCall);
module.exports = router;
