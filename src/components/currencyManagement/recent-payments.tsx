import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, Order, selectOrderState } from '@/app/redux/slices/api/orderSlice';
import { RootState } from '@/app/redux/store';
import { AppDispatch } from '@/app/redux/store';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './currency-management.css';
import '@/../public/assets/css/table.css';
import '@/../public/assets/css/master.css';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

const RecentPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
    let filteredData: Order[] = [...(orders?.data || [])];

  const token = Cookies.get('token') || '';
  let decodedToken: CustomJwtPayload | null = null;

  if (token !== '') {
    decodedToken = jwtDecode<CustomJwtPayload>(token);
  }
  const userId = decodedToken?.id || 0;

  useEffect(() => {
    dispatch(fetchAllOrders(`${userId}`));
  }, [dispatch, userId]);

  return (
    <Card className="table-container">
      <CardContent>
        <section className="table-header mb-40">
          <Typography variant="h4" className="cardHeading">
            <i className="ri-table-line"></i> Active Payments
          </Typography>
        </section>
        <Divider />
        <section className="table-body scroll">
          <Table className="ledger">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Status</TableCell>
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
                filteredData?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.txnStatus}</TableCell>
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
        </section>
      </CardContent>
    </Card>
  );
};

export default RecentPayments;
