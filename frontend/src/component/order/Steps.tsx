import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { Divider, Modal } from "@mui/material";

import { RootState } from "../../redux/store";

const steps = [
  {
    label: "Invoice",
    description: `Input all the data correctly.`,
    alert: ""
  },
  {
    label: "Payment",
    description: "We're waiting for your payment.",
    alert: "Contact with Seller To approve your payment"
  },
  {
    label: "Order Process",
    description: "We're processing your order.",
    alert: ""
  },
  {
    label: "Delivery, complete",
    description: "Your product is  delivered",
    alert: "Your Traking Id is "
  }
];

interface OrderStepperProps {
  stepNo?: any;
  handleNext?: any;
}

export default function OrderStepper(props: OrderStepperProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#f94316"
      }
    },
    typography: {
      allVariants: {
        color: "#000000"
      }
    }
  });

  const { stepNo } = props;

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Confirm
          </Typography>
          <Divider
            sx={{
              marginBottom: "20px",
              scrollSnapMarginTop: "20px"
            }}
          />
          <Typography
            sx={{
              marginBottom: "20px",
              scrollSnapMarginTop: "20px"
            }}
            component="h2"
          >
            Are you sure?
          </Typography>
          <div className="flex flex-row justify-end gap-x-2">
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                props.handleNext();
                setModalOpen(false);
              }}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                setModalOpen(false);
              }}
              size="small"
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper
          activeStep={stepNo!}
          orientation={window.innerWidth >= 768 ? "vertical" : "horizontal"}
          className="mt-2.5 overflow-x-auto"
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>
                  {window.innerWidth >= 768 ? step.description : ""}
                </Typography>
                {user?.state == 1 && index != steps.length - 1 ? (
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setModalOpen(true)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 2 ? "Finish" : "Continue"}
                      </Button>
                    </div>
                  </Box>
                ) : (
                  <></>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </ThemeProvider>
  );
}
