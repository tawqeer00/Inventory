import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { ShoppingCart, Person, Payment, Print } from "@mui/icons-material";
import ProductSelection from "./steps/ProducSelection";
import CustomerInfo from "./steps/CustomerInfo";
import Checkout from "./steps/Checkout";
import Invoice from "./steps/Invoice";
import "./sellProducts.scss";

const steps = [
  { label: "Select Products", icon: <ShoppingCart /> },
  { label: "Customer Info", icon: <Person /> },
  { label: "Checkout", icon: <Payment /> },
  { label: "Print Invoice", icon: <Print /> },
];

function Sell() {
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({});

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // If it's the last step, reset to the first step (Product Selection)
      setActiveStep(0);
      setCart([]); // Reset cart
      setCustomer({}); // Reset customer info
    } else {
      setActiveStep((prevStep) => prevStep + 1); // Move to next step
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleReset = () => {
    setActiveStep(0);
    setCart([]);
    setCustomer({});
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ProductSelection cart={cart} setCart={setCart} />;
      case 1:
        return <CustomerInfo customer={customer} setCustomer={setCustomer} />;
      case 2:
        return <Checkout cart={cart} customer={customer} />;
      case 3:
        return <Invoice cart={cart} customer={customer} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "100%", margin: "auto", mt: 5 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              icon={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: activeStep === index ? "#007BFF" : "#666", // Highlight current step
                    
                  }}
                >
                  {step.icon}
                </Box>
              }
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: activeStep === index ? "bold" : "normal",
                  color: activeStep === index ? "#007BFF" : "#666",
                }}
              >
                {step.label}
              </span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 5 }}>
        {activeStep === steps.length ? (
          <Box>
            <Button onClick={handleReset} variant="contained">
              Reset
            </Button>
          </Box>
        ) : (
          <Box>
            {getStepContent()}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ fontSize: "14px" ,ml:12}}>
                Back
              </Button>
              <Button onClick={handleNext} variant="contained" sx={{ fontSize: "14px",mr:12 }}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Sell;
