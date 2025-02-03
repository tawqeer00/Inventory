
const Customer = require("../models/customerModel");
const Product = require("../models/productModel"); // Assuming Product model exists
const mongoose = require("mongoose");
const moment = require("moment");
const Order = require("../models/orderModel");



//Invoice api
const createCustomerOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID comes from authentication middleware
    const { customer, cart } = req.body;

    // Prepare customer data
    const customerData = {
      user_id: userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };

    // Map cart items to customer_products
    const customerProducts = cart.map((item) => ({
      product_id: item._id,
      quantity: item.quantity,
      price: item.price,

    }));

    // Check if the customer already exists
    let customerRecord = await Customer.findOne({
      $or: [{ email: customer.email }, { phone: customer.phone }],
      user_id: userId,
    });

    if (!customerRecord) {
      // Create a new customer if none exists
      customerRecord = new Customer(customerData);
      await customerRecord.save();
    }

    let totalOrderPrice = 0;

    // Validate and update product stock
    for (let product of customerProducts) {
      const productInStock = await Product.findById(product.product_id);

      if (!productInStock) {
        return res.status(404).json({
          error: `Product with ID ${product.product_id} not found.`,
        });
      }

      if (productInStock.quantity < product.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product: ${productInStock.name}.`,
        });
      }

      productInStock.quantity -= product.quantity;
      await productInStock.save();

      totalOrderPrice += product.price * product.quantity;
    }

    // Create a new order for the customer
    const newOrder = new Order({
      user_id: userId,
      customer_id: customerRecord._id,
      customer_products: customerProducts,
      customer_order_total: totalOrderPrice,
      customer_order_status: "pending", // Default status
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Customer order created successfully.",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating customer order:", error);
    res.status(500).json({
      error: "An error occurred while creating the customer order.",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate input
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "Order ID and status are required.",
      });
    }

    // Use $set to update the status field
    const updatedOrder = await Order.updateOne(
      { _id: orderId }, // Find order by ID
      { $set: { status } } // Update status using $set
    );

    // Check if the order was found and updated
    if (updatedOrder.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: `Order with ID ${orderId} not found or status already updated.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while updating the order status.",
    });
  }
};






const generateInvoice = async (req, res) => {
  try {
    const { customer_id } = req.params; // Customer ID from URL parameters
    const { date } = req.query; // Date from query parameters (optional)

    // Build the match condition dynamically
    const matchCondition = { _id: new mongoose.Types.ObjectId(customer_id) };

    // If a date is provided, add the date range filter
    if (date) {
      const startOfDay = moment(date, "YYYY-MM-DD").startOf("day").toDate();
      const endOfDay = moment(date, "YYYY-MM-DD").endOf("day").toDate();
      matchCondition.customer_order_date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Aggregate to get the customer order with product details
    const invoiceData = await Customer.aggregate([
      { $match: matchCondition }, // Match the customer and optionally filter by date
      { $unwind: "$customer_products" }, // Deconstruct the customer_products array
      {
        $lookup: {
          from: "products", // Join with the 'products' collection
          localField: "customer_products.product_id", // Match customer_products.product_id with the product _id
          foreignField: "_id", // Match it to the _id of the product
          as: "product_details", // Output the matched products in a new field "product_details"
        },
      },
      { $unwind: "$product_details" }, // Unwind the product details (flatten the result)
      {
        $project: {
          customer_name: 1,
          customer_email: 1,
          customer_phone: 1,
          customer_address: 1,
          "product_details.name": 1, // Include product name
          "product_details.price": 1, // Include product price
          "customer_products.quantity": 1, // Include product quantity
          customer_order_total: 1, // Include the total order amount
          customer_order_date: 1, // Include the order date
        },
      },
    ]);

    if (!invoiceData.length) {
      return res.status(404).json({
        error: "Customer order not found.",
      });
    }

    // Generate the invoice details
    const invoice = {
      customer_name: invoiceData[0].customer_name,
      customer_email: invoiceData[0].customer_email,
      customer_phone: invoiceData[0].customer_phone,
      customer_address: invoiceData[0].customer_address,
      products: invoiceData.map((item) => ({
        product_name: item.product_details.name,
        quantity: item.customer_products.quantity,
        price: item.product_details.price,
        total: item.customer_products.quantity * item.product_details.price,
      })),
      order_total: invoiceData[0].customer_order_total,
      order_date: invoiceData[0].customer_order_date,
    };

    // Send the invoice as a response
    res.status(200).json({
      success: true,
      message: "Invoice generated successfully.",
      invoice,
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({
      error: "An error occurred while generating the invoice.",
    });
  }
};

const getCustomersByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the user_id is passed as a URL parameter

    // Find customers associated with the provided user_id
    const customers = await Customer.find({ user_id: id });

    // Return the customers
    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully.",
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      error: "An error occurred while fetching customers.",
    });
  }
};
const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Aggregate customers with pagination
    const customers = await Customer.aggregate([
      { $match: { user_id: { $exists: true, $ne: null } } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Count the total number of matching customers
    const totalCount = await Customer.countDocuments({
      user_id: { $exists: true, $ne: null },
    });

    // Return the paginated customers
    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully.",
      data: {
        customers,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      error: "An error occurred while fetching customers.",
    });
  }
};


const customerOrders = async (req, res) => {
  try {
    // Aggregate customers with a filter for those having a user_id
    const customersOrders = await Order.aggregate([
      {
        $match: {
          user_id: { $exists: true, $ne: null }, // Filters customers with non-null user_id
        },
      },
    ]);

    // Count the total number of matching customers
    const totalCount = await Order.countDocuments({
      user_id: { $exists: true, $ne: null },
    });

    // Return the customers along with the total count
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: {
        customersOrders,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      error: "An error occurred while fetching customers.",
    });
  }
};




const getOrdersByMonth = async (req, res) => {
  try {
    const { year = moment().year(), status } = req.query;

    // Create start and end of the year using Moment.js
    const startOfYear = moment().year(year).startOf("year").toDate();
    const endOfYear = moment().year(year).endOf("year").toDate();

    // Build match criteria for MongoDB aggregation
    const matchCriteria = {
      createdAt: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    };

    // Add status filter if provided
    if (status) {
      matchCriteria.status = status;
    }

    // Fetch orders grouped by month
    const ordersByMonth = await Order.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: { $month: "$createdAt" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Initialize an array for all 12 months
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      orderCount: 0,
    }));

    // Map database results to the full year array
    ordersByMonth.forEach((order) => {
      months[order._id - 1].orderCount = order.orderCount;
    });

    // Convert month numbers to readable names
    const monthNames = months.map((item) =>
      moment().month(item.month - 1).format("MMMM")
    );

    const formattedData = months.map((item, index) => ({
      month: monthNames[index],
      orderCount: item.orderCount,
    }));

    // Send response
    res.json({ year, ordersByMonth: formattedData });
  } catch (error) {
    console.error("Error fetching orders by month:", error);
    res.status(500).json({ error: "An error occurred while fetching orders." });
  }
};


const getOrderStatusCounts = async (req, res) => {
  try {
    const { year = moment().year() } = req.query;

    // Create start and end of the year using Moment.js
    const startOfYear = moment().year(year).startOf("year").toDate();
    const endOfYear = moment().year(year).endOf("year").toDate();

    // Fetch total counts for each status
    const orderStatuses = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format statuses for frontend
    const statusCounts = orderStatuses.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      { completed: 0, cancelled: 0, pending: 0 }
    );

    // Total orders
    const totalOrders = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    // Send response
    res.json({ statusCounts, totalOrders });
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    res.status(500).json({ error: "An error occurred while fetching order status counts." });
  }
};






module.exports = {
  createCustomerOrder,
  updateOrderStatus,
  getCustomersByUserId,
  generateInvoice,
  getCustomers,
  customerOrders,
  getOrdersByMonth,
  getOrderStatusCounts
};
