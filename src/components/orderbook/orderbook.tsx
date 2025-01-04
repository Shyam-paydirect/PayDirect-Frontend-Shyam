import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
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

  // Helper function for status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTC':
        return 'green';
      case 'RJCT':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Page Header */}
      <Typography variant="h4" sx={{ marginBottom: 3, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {orderData?.map((order) => (
          <Box
            key={order.id}
            sx={{
              position: 'relative',
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: 3,
              overflow: 'visible', // Prevent cropping of the order ID box
            }}
          >
            {/* Order ID (Popping Out Top-Left) */}
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                left: 16,
                backgroundColor: '#a9a9a9',
                color: '#ffffff',
                paddingX: 2,
                paddingY: 0.5,
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '1rem' },
                borderRadius: '4px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              {order.orderId}
            </Box>

            {/* Card Content */}
            <Card
              sx={{
                display: 'flex',
                flexDirection:'row',
                alignItems: { xs: 'flex-start', sm: 'center' },
                padding: 2,
                gap: { xs: 1, sm: 2 },
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 0.5, sm: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ flexShrink: 0, fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                    Response Type:
                  </Typography>
                  <Typography variant="body1" sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}>{order.responseType}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ flexShrink: 0, fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                    Payment Mode:
                  </Typography>
                  <Typography variant="body1" sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}>{order.paymentMode}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="body1" sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' }, fontWeight: 600 }}>{order.txnStatusDescription}</Typography>
                </Box>
              </CardContent>

              {/* Transaction Status (Extreme Right) */}
              <Box
                sx={{
                  marginLeft: 'auto',
                  padding: 2,
                  borderRadius: 2,
                  fontWeight: 600,
                  color: getStatusColor(order.txnStatus),
                  textAlign: 'center',
                  minWidth: { xs: 80, sm: 100 },
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                  fontSize: { xs: '0.75rem', sm: '1rem' },
                }}
              >
                {order.txnStatus}
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrderPage;
