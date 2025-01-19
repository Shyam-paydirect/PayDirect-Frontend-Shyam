import React from "react";
import { Box, Typography, Stepper, Step, StepLabel, useMediaQuery, useTheme, LinearProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Step {
  label: string;
  description: string;
}

interface PaymentProgressProps {
  steps: Step[];
  activeStep: number;
}

const PaymentProgress: React.FC<PaymentProgressProps> = ({ steps, activeStep }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width={isSmallScreen ? "100%" : "30%"}
      bgcolor="#f9f9f9"
      px={isSmallScreen ? 2 : 4}
      py={3}
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#333",
          marginBottom: "16px",
          fontSize: isSmallScreen ? "18px" : "24px",
        }}
      >
        Payment Progress
      </Typography>

      <LinearProgress
        variant="determinate"
        value={((activeStep + 1) / steps.length) * 100}
        sx={{
          width: "100%",
          height: 10,
          borderRadius: "5px",
          backgroundColor: "#e0e0e0",
          marginBottom: "24px",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#007BFF",
          },
        }}
      />

      <Stepper
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        activeStep={activeStep}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: isSmallScreen ? "row" : "column",
          justifyContent: isSmallScreen ? "space-between" : "flex-start",
          alignItems: isSmallScreen ? "center" : "flex-start",
          padding: 0,
        }}
      >
        {steps.map((step, index) => (
          <Step key={index} sx={{ flex: isSmallScreen ? 1 : "unset" }}>
            <StepLabel
              icon={
                index < activeStep ? (
                  <CheckCircleIcon sx={{ color: "green", fontSize: isSmallScreen ? "16px" : "20px" }} />
                ) : (
                  <div
                    style={{
                      width: isSmallScreen ? "20px" : "24px",
                      height: isSmallScreen ? "20px" : "24px",
                      borderRadius: "50%",
                      backgroundColor: index === activeStep ? "#007BFF" : "#ccc",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: isSmallScreen ? "10px" : "14px",
                    }}
                  >
                    {index + 1}
                  </div>
                )
              }
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems={isSmallScreen ? "center" : "flex-start"}
                textAlign={isSmallScreen ? "center" : "left"}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: index === activeStep ? "#007BFF" : "#000",
                    fontSize: isSmallScreen ? "10px" : "14px",
                  }}
                >
                  {step.label}
                </Typography>
                {!isSmallScreen && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: index === activeStep ? "#007BFF" : "rgba(0, 0, 0, 0.6)",
                      fontSize: "12px",
                    }}
                  >
                    {step.description}
                  </Typography>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default PaymentProgress;
