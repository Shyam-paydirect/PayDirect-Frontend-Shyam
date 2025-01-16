import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Menu,
  InputAdornment,
  MenuItem,
  TextField,
  Button,
  Divider,

} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllOrders, Order, selectOrderState } from '@/app/redux/slices/api/orderSlice';
import { AppDispatch } from '@/app/redux/store';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BallTriangle } from 'react-loader-spinner';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import { Visibility } from '@mui/icons-material';
import { fetchDocuments } from '@/app/redux/slices/api/documentSlice';
import { toast } from 'react-toastify';

const OrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(selectOrderState);

  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    let filteredData: Order[] = [...(orders?.data || [])];

    if (statusFilter) {
      filteredData = filteredData.filter(order => order.txnStatus === statusFilter);
    }

    if (searchTerm) {
      filteredData = filteredData.filter(order =>
        order.receivingPartyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filteredData = filteredData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredOrders(filteredData);
  }, [statusFilter, sortOrder, searchTerm, orders]);

  const handleReload = () => {
    dispatch(fetchAllOrders());
  }

  const handleDocumentClick = (id: any) => {
    dispatch(setCurrentDashboard('document-uploads'));
    localStorage.setItem("orderID", id)
  }

  const handleViewDocuments = async(id: any) => {
    const emptyOrNot = await dispatch(fetchDocuments(id)).unwrap();
    if(emptyOrNot?.allDocs?.length == 0){
      toast.error("Please upload Documents first");
    }
    else{
      dispatch(setCurrentDashboard('document-viewer'));
      localStorage.setItem("orderID", id)
    }
  }

  const getTimeDifference = (inputTime: string) => {
    const now = moment();
    const pastTime = moment(inputTime);
    const duration = moment.duration(now.diff(pastTime));

    const hours = Math.floor(duration.asHours());
    if (hours < 1) {
      return 'Last Updated: < 1h ago';
    } else {
      return `Last Updated: ${hours}h ago`;
    }
  }

  const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setStatusAnchorEl(null);
    setSortAnchorEl(null);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACCP':
        return '#006d04';
      case 'ACTC':
        return '#4caf50';
      case 'RJCT':
        return '#f44336';
      case 'PENDING':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: 3, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' } }}
      >
        Orders
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search by Receiving Party Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: '100%',
          marginBottom: 3,
          backgroundColor: 'transparent',
          borderRadius: 1,
          '.MuiOutlinedInput-root': {
            padding: '0 10px',
            border: '1px solid #ccc',
            '&:hover': { borderColor: '#888' },
            '&.Mui-focused': { borderColor: '#1976d2' },
          },
          '.MuiInputBase-input': {
            padding: '12px 12px',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#888' }} />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        onClick={handleReload}
        sx={{
          position: 'absolute',
          right: 50,
          bottom: 50,
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '50%',
          width: { xs: 48, sm: 56, md: 64 }, // Circle size
          height: { xs: 48, sm: 56, md: 64 },
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#0056b3',
            boxShadow: '0 6px 12px rgba(0, 86, 179, 0.4)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          zIndex: 5
        }}
      >
        <RefreshIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }} />
      </Button>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={handleStatusClick}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': { backgroundColor: '#333' },
          }}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>Status</Typography>
        </Button>
        <Menu
          anchorEl={statusAnchorEl}
          open={Boolean(statusAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { setStatusFilter(''); handleClose(); }}>All</MenuItem>
          <MenuItem onClick={() => { setStatusFilter('ACTC'); handleClose(); }}>Accepted</MenuItem>
          <MenuItem onClick={() => { setStatusFilter('RJCT'); handleClose(); }}>Rejected</MenuItem>
          <MenuItem onClick={() => { setStatusFilter('PENDING'); handleClose(); }}>Pending</MenuItem>
        </Menu>

        <Button
          variant="contained"
          onClick={handleSortClick}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': { backgroundColor: '#333' },
          }}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>Sort By Date</Typography>
        </Button>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { setSortOrder('asc'); handleClose(); }}>Ascending</MenuItem>
          <MenuItem onClick={() => { setSortOrder('desc'); handleClose(); }}>Descending</MenuItem>
        </Menu>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 4, height: '50vh' }}>
          <BallTriangle
            height={100}
            width={100}
            color="#000"
            ariaLabel="loading-indicator"
          />
        </Box>
      )
        :
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {
            filteredOrders.length > 0 ?
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={index >= 5 ? 'hidden' : false}
                  animate={{ opacity: 1, y: 0 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#ffffff',
                      padding: 3,
                      borderRadius: 4,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      border: '1px solid #e0e0e0',
                      position: 'relative',
                      marginY: 1
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        left: 15,
                        backgroundColor: 'rgb(111, 0, 255)',
                        padding: '8px 16px',
                        borderRadius: 4,
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
                        fontWeight: 600,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        zIndex: 5,
                        color: 'white'
                      }}
                    >
                      {order.orderId}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        marginTop: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#0056b3', // Professional blue color
                          flex: 1,
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        }}
                      >
                        {order?.receivingPartyName || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, }}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 500, flex: 1, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                        Response Type:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, flex: { xs: 2, sm: 3, md: 4 }, textAlign: 'left', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                        {order.responseType}
                      </Typography>
                    </Box>

                    {
                      order.responseType == 'ACK2' && order.txnStatus == 'ACCP' &&
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 40,
                          bottom: 155, // Adjust position relative to ACCP
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          // startIcon={<Icon>description</Icon>} // Icon for the document
                          sx={{
                            textTransform: 'none',
                            padding: '8px 16px',
                            borderRadius: 8,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            backgroundColor: '#673ab7',
                            '&:hover': {
                              backgroundColor: '#5e35b1',
                            },
                          }}
                          onClick={() => handleDocumentClick(order.orderId)}
                        >
                          {/* View Documents */}
                          <DescriptionIcon />
                        </Button>

                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{
                            textTransform: 'none',
                            marginLeft: '10px',
                            padding: '10px 16px',
                            borderRadius: 8,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                          onClick={() => handleViewDocuments(order.orderId)}

                        >
                          <Visibility sx={{ fontSize: '1.2rem', color: '#673ab7' }} />
                        </Button>
                      </Box>
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 500, flex: 1, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                        Payment Mode:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, flex: { xs: 2, sm: 3, md: 4 }, textAlign: 'left', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                        {order.paymentMode}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ position: 'absolute', right: 50, top: 55, fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, color: getStatusColor(order.txnStatus), flex: 1 }}
                    >
                      {order.txnStatus}
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#424242', flex: 2, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                        {order.txnStatusDescription}
                      </Typography>
                      <Typography sx={{ color: 'blue', fontWeight: 500, flex: 1, textAlign: 'right', fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' } }}>
                        {getTimeDifference(order.updatedAt)}
                      </Typography>

                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          color: '#9e9e9e', // Grey color for a subtle appearance
                          flex: 1,
                          textAlign: 'right',
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        }}
                      >
                        {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))
              :
              <Box sx={{ textAlign: 'center', padding: 2 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 500"
                  width="300"
                  height="300"
                  aria-labelledby="noOrdersTitle"
                >
                  <title id="noOrdersTitle">No Orders Illustration</title>
                  <rect x="100" y="100" width="300" height="300" fill="#fefefe" rx="16" />
                  <rect x="140" y="160" width="220" height="100" fill="#d0e7ff" rx="8" />
                  <line x1="140" y1="180" x2="360" y2="180" stroke="#8ab6e9" strokeWidth="4" />
                  <line x1="140" y1="200" x2="360" y2="200" stroke="#8ab6e9" strokeWidth="4" />
                  <line x1="140" y1="220" x2="360" y2="220" stroke="#8ab6e9" strokeWidth="4" />
                  <circle cx="120" cy="80" r="20" fill="#a2c9f3" />
                  <circle cx="380" cy="400" r="30" fill="#fdeac8" />
                </svg>
                <Typography variant="h6" sx={{ marginTop: '20px', color: '#757575' }}>
                  No Orders Yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  Try adjusting the filters or check back later.
                </Typography>
              </Box>
          }
        </Box>
      }
    </Box>
  );
};

export default OrderPage;
