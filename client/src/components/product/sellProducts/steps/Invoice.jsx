import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "../../../../env";

function Invoice({ cart, customer, orderId }) {
  console.log("order id", orderId);
  const invoiceRef = useRef();
  const [orderStatus, setOrderStatus] = useState("pending");

  const totalPrice = cart.reduce((total, product) => {
    const price = parseFloat(product.price);
    return total + (isNaN(price) ? 0 : price * product.quantity);
  }, 0);

  const handlePrintAndSend = async () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f9;
            margin: 0;
          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h4, h6 {
            font-weight: 600;
          }
          .card {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background-color: #f9f9f9;
          }
          .total {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
          }
          .button {
            display: none; /* Hide buttons on print */
          }
          .invoice-title {
            font-weight: 600;
            margin-bottom: 3px;
            color: #333;
            border-bottom: 2px solid #007BFF;
            padding-bottom: 1px;
            text-align: center;
          }
          .customer-info,
          .product-details,
          .total-price {
            margin-bottom: 20px;
          }
          .product-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <h4 class="invoice-title">Invoice</h4>
  
          <!-- Customer Information -->
          <div class="customer-info">
            <h6>Customer Information</h6>
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
          </div>
  
          <!-- Product Details -->
          <div class="product-details">
            <h6>Product Details</h6>
            ${
              cart.length === 0
                ? "<p>No products purchased.</p>"
                : cart
                    .map((product) => {
                      const price = parseFloat(product.price);
                      return `
                <div class="product-item">
                  <div>
                    <p><strong>${product.name}</strong></p>
                    <p>Quantity: ${product.quantity}</p>
                  </div>
                  <div style="text-align: right;">
                    <p>${isNaN(price) ? "N/A" : "$" + price.toFixed(2)}</p>
                    <p>Total: ${
                      isNaN(price)
                        ? "N/A"
                        : "$" + (price * product.quantity).toFixed(2)
                    }</p>
                  </div>
                </div>
              `;
                    })
                    .join("")
            }
          </div>
  
          <!-- Total Price -->
          <div class="total-price">
            <h6>Total Price: <span style="color: #007BFF">${totalPrice.toFixed(
              2
            )}</span></h6>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    // Step 2: Send Invoice Email
    const emailData = {
      customerEmail: customer.email,
      subject: "Your Invoice",
      htmlContent: printContent,
    };

    try {
      const response = await fetch(
        `${REACT_APP_BACKEND_URL}/contactus/send-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Invoice printed and sent to customer successfully!");
      } else {
        alert("Failed to send invoice. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the invoice. Please try again.");
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setOrderStatus(newStatus);

    try {
      const response = await axios.patch(
        `${REACT_APP_BACKEND_URL}/customer/orders/update-status/`,
        {
          orderId: localStorage.getItem("orderId"), 
          status: newStatus,
        }
      );
      console.log(response);

      if (response.data.success) {
        toast.success("Order status updated successfully!");
      } else {
        toast.error("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating the order status.");
    }
  };

  return (
    <Box
      sx={{
        width: "800px",
        ml: 16,
        padding: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div ref={invoiceRef}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            marginBottom: 3,
            color: "#333",
            borderBottom: "2px solid #007BFF",
            paddingBottom: 1,
          }}
        >
          Invoice
        </Typography>

        {/* Customer Info */}
        <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: "8px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                marginBottom: 2,
                borderBottom: "1px solid #eee",
                paddingBottom: 1,
              }}
            >
              Customer Information
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Name:</strong> {customer.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Email:</strong> {customer.email}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Phone:</strong> {customer.phone}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {customer.address}
            </Typography>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: "8px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                marginBottom: 2,
                borderBottom: "1px solid #eee",
                paddingBottom: 1,
              }}
            >
              Product Details
            </Typography>
            {cart.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No products purchased.
              </Typography>
            ) : (
              cart.map((product, index) => {
                const price = parseFloat(product.price);
                return (
                  <Grid
                    container
                    key={index}
                    spacing={2}
                    sx={{
                      marginBottom: 2,
                      paddingBottom: 2,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Grid item xs={8}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {product.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {product.category}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ${isNaN(price) ? "N/A" : price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total:{" "}
                        {isNaN(price)
                          ? "N/A"
                          : (price * product.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Total Price */}
        <Card
          sx={{ boxShadow: 3, borderRadius: "8px", backgroundColor: "#f1f8ff" }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total Price:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#007BFF" }}>
              ${totalPrice.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        {/* Order Status Dropdown */}
        <Card sx={{ marginTop: 3, boxShadow: 3, borderRadius: "8px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                marginBottom: 2,
                borderBottom: "1px solid #eee",
                paddingBottom: 1,
              }}
            >
              Update Order Status
            </Typography>
            <FormControl fullWidth>
              
              <Select
                labelId="order-status-label"
                value={orderStatus}
                onChange={handleStatusChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </div>

      {/* Print Button */}
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600, padding: "10px 20px", fontSize: "12px" }}
          onClick={handlePrintAndSend}
        >
          Print and Send Invoice
        </Button>
      </Box>
    </Box>
  );
}

export default Invoice;
