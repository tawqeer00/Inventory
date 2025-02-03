import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

function Checkout({ cart, customer }) {
  const [orderDetails, setOrderDetails] = useState(null); // State to share data

  // Calculate the total price with proper type conversion for price
  const totalPrice = cart.reduce((total, product) => {
    const price = parseFloat(product.price); // Ensure price is a number
    return total + (isNaN(price) ? 0 : price * product.quantity);
  }, 0);

  const handleCheckout = async () => {
    try {
      const checkoutData = {
        customer,
        cart,
        totalPrice,
      };

      const response = await axios.post(
        "http://localhost:8080/api/customer/",
        checkoutData
      );

      if (response.status === 201) {
        toast.success("Checkout successful!");
        setOrderDetails(response.data);
        console.log(response.data.data._id)
        localStorage.setItem("orderId",response.data.data._id)
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("There was an error during checkout.");
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
      {/* Checkout Header */}
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
        Checkout
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

      {/* Cart Details */}
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
            Products in Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No products in cart.
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
        sx={{
          boxShadow: 3,
          borderRadius: "8px",
          backgroundColor: "#f1f8ff",
        }}
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
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600, padding: "10px 20px", fontSize: "12px" }}
          onClick={handleCheckout}
        >
          Confirm Checkout
        </Button>
      </Box>
    </Box>
  );
}

export default Checkout;
