const express = require("express");
const { contactUs,sendInvoiceEmail } = require("../controllers/contactController");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");

router.post("/", protect, contactUs);
router.post("/send-invoice", sendInvoiceEmail);

module.exports = router;
