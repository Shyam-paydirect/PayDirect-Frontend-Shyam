import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  TableContainer
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, Order, setSelectedOrderId } from "@/app/redux/slices/api/orderSlice";
import { RootState } from "@/app/redux/store";
import { AppDispatch } from "@/app/redux/store";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { setCurrentDashboard } from "@/app/redux/slices/dashboardSlice";
import styles from './recent-payments.module.css';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

const RecentPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const filteredData: Order[] = [...(orders?.data || [])];

  const token = Cookies.get("token") || "";
  let decodedToken: CustomJwtPayload | null = null;

  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token);
  }
  const userId = decodedToken?.id || 0;

  useEffect(() => {
    dispatch(fetchAllOrders(`${userId}`));
  }, [dispatch, userId]);

  const getStepPercentage = (statusPayment: string) => {
    return (Number(statusPayment) / 4) * 100; // Assuming 4 total steps
  };

  const getStepColor = (currentStep: string) => {
    switch (currentStep) {
      case "1":
        return "#f44336"; // Red
      case "2":
        return "#ff9800"; // Orange
      case "3":
        return "#ffeb3b"; // Yellow
      case "4":
        return "#8bc34a"; // Green (optional if all steps complete)
      default:
        return "#e0e0e0"; // Gray for incomplete steps
    }
  };

  const StatusBox = (currentStep: string) => {
    let statusText = "", modifier = "";
    switch (currentStep) {
      case "1":
        statusText = 'Payment Initiated';
        modifier = 'status--payment-initiated';
        break;
      case "2":
        statusText = 'Documents Uploaded';
        modifier = 'status--documents-uploaded';
        break;
      case "3":
        statusText = 'FX Rate Booked';
        modifier = 'status--fx-rate-booked';
        break;
      case "4":
        statusText = 'Completed';
        modifier = 'status--completed';
        break;
      default:
        statusText = 'In Progress';
        modifier = 'status--in-progress';
        break;
    }
    return (
      <div className={`${styles.status} ${styles[modifier]}`}>
        {statusText}
      </div>
    );
  };

  const renderProgressBar = (statusPayment: string) => {
    const stepPercentage = getStepPercentage(statusPayment);
    const stepColor = getStepColor(statusPayment);

    return (
      <div className="progress w-full bg-gray-200 rounded-md h-4 overflow-hidden">
        <div className="progress-bar progress-bar-striped w-[10%]"
          style={{
            width: `${stepPercentage}%`,
            backgroundColor: stepColor,
          }}
        ></div>
      </div>
    );
  };

  const handleRowClick = (orderId: string, statusPayment: string) => {
    dispatch(setSelectedOrderId(orderId));
    switch (statusPayment) {
      case "1":
        dispatch(setCurrentDashboard("document-uploads"));
        break;
      case "2":
        dispatch(setCurrentDashboard("document-uploads"));
        break;
      case "3":
        dispatch(setCurrentDashboard("track-payments"));
        break;
      case "4":
        dispatch(setCurrentDashboard("track-payments"));
        break;
      default:
        dispatch(setCurrentDashboard("currency-management"));
    }
  };

  return (
    <div className="trade-payments-parent commonCard">

      <section className="heading ">
        <div className="cardHeading">
          Active Payments
        </div>
      </section>
      <Divider />
      <TableContainer 
       sx={{
         maxWidth: "100%",
         margin: "auto",
         maxHeight: 5 * 48 + 56,    // approx row height (48px) × 5 rows + header height (56px)
         overflowY: "auto"
       }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: `var(--accent-clr-1)` }}>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  width: "33.33%", // Ensures equal width for all columns
                  color: `var(--white)`
                }}
              >
                Order ID
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  width: "33.33%",
                  color: `var(--white)`
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  width: "33.33%",
                  color: `var(--white)`
                }}
              >
                Progress
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography align="center">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography align="center" color="error">
                    Error fetching data
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredData?.length > 0 ? (
              filteredData
                ?.sort((a, b) => {
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA;
                })
                .map((order, index) => (
                  <TableRow
                    key={order.id}
                    style={{
                      cursor: "pointer",
                      transition: "background-color 0.2s ease-in-out",
                      backgroundColor: index % 2 === 0 ? "#fefefe" : "#fafafa", // Alternating row colors
                    }}
                    onClick={() => handleRowClick(order.orderId, order.statusPayment)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#fefefe" : "#fafafa")
                    }
                  >
                    <TableCell align="center" sx={{ width: "33.33%", fontSize: '10px' }}>
                      {order.orderId}
                    </TableCell>
                    <TableCell align="center" sx={{ width: "33.33%" }}>
                      {StatusBox(order.statusPayment)}
                    </TableCell>
                    <TableCell align="center" sx={{ width: "33.33%" }}>
                      {renderProgressBar(order.statusPayment)}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography align="center">No Records Found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <section className="heading ">
      </section>

    </div>
  );
};

export default RecentPayments;
