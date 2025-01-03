import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllOrders, selectOrderState } from '@/app/redux/slices/api/orderSlice';
import { AppDispatch } from '@/app/redux/store';

const OrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(selectOrderState);
  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  

  const orderData = orders?.data || [];

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Page Header */}
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Orders
      </Typography>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box sx={{ marginTop: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Orders List */}
      <Grid container spacing={3}>
        {orderData?.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Order ID
                </Typography>
                <Typography variant="h6">{order.orderId}</Typography>

                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Response Type
                </Typography>
                <Typography variant="body1">{order.responseType}</Typography>

                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Payment Mode
                </Typography>
                <Typography variant="body1">{order.paymentMode}</Typography>

                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Transaction Status
                </Typography>
                <Typography variant="body1">{order.txnStatus}</Typography>

                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Transaction Description
                </Typography>
                <Typography variant="body1">{order.txnStatusDescription}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrderPage;
