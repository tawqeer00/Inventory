const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const { createCustomerOrder,updateOrderStatus,getCustomersByUserId, generateInvoice,getCustomers,customerOrders,getOrdersByMonth,getOrderStatusCounts } = require("../controllers/customerController");
const { upload } = require("../utils/fileUpload");

router.post("/",protect, createCustomerOrder);
router.patch("/orders/update-status",protect, updateOrderStatus);
// router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/:id", getCustomersByUserId);
router.get("/", protect, getCustomers);
router.get("/orders",protect, customerOrders);
router.get('/orders/orders-by-month',protect, getOrdersByMonth);
router.get('/orders/orders-status-counts',protect, getOrderStatusCounts);
// router.get("/:id", protect, getProduct);
// router.delete("/:id", protect, deleteProduct);
router.get("/invoice/:customer_id",generateInvoice)
module.exports = router;
