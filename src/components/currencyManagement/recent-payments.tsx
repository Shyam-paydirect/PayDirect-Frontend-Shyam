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
  LinearProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, Order, selectOrderState } from "@/app/redux/slices/api/orderSlice";
import { RootState } from "@/app/redux/store";
import { AppDispatch } from "@/app/redux/store";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
    return ((Number(statusPayment)) / 4) * 100; // Assuming 4 total steps
  };

  const getStepColor = (currentStep: string) => {
    switch (currentStep) {
      case '1':
        return "#f44336"; // Red
      case '2':
        return "#ff9800"; // Orange
      case '3':
        return "#ffeb3b"; // Yellow
      case '4':
        return "#8bc34a"; // Green (optional if all steps complete)
      default:
        return "#e0e0e0"; // Gray for incomplete steps
    }
  };

  const renderLinearProgressBar = (statusPayment: string) => {
    const stepPercentage = getStepPercentage(statusPayment);
    const barColor = getStepColor(statusPayment);
    
    console.log("statusPayment", typeof(statusPayment), stepPercentage, barColor)
    return (
      <LinearProgress
        variant="determinate"
        value={stepPercentage}
        sx={{
          width: "100%",
          height: 10,
          borderRadius: "5px",
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: barColor,
          },
        }}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Active Payments
        </Typography>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography align="center">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography align="center" color="error">
                    Error fetching data
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredData?.length > 0 ? (
              filteredData?.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
              } ).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{renderLinearProgressBar(order.statusPayment)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography align="center">No Records Found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentPayments;
