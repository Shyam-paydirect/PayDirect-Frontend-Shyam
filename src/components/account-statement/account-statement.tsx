import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { fetchBalanceEnquiry, fetchAccountStatement } from '@/app/redux/slices/api/accountBalanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast, ToastContainer } from 'react-toastify';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const sampleTrendData = [
  { date: '2025-02-20', spending: 500 },
  { date: '2025-02-21', spending: 750 },
  { date: '2025-02-22', spending: 600 },
  { date: '2025-02-23', spending: 900 },
  { date: '2025-02-24', spending: 650 },
  { date: '2025-02-25', spending: 800 },
];

const AccountStatement: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const balancePercentage = 20;
  const dispatch = useDispatch<AppDispatch>();

  const formatWithCommas = (value: string, format: 'IND' | 'INTL'): string => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (isNaN(numValue)) return value;

    const integerPart = Math.floor(numValue).toString();
    const decimalPart = value.includes('.') ? value.split('.')[1] : '';

    let formattedInteger = '';

    if (format === 'IND') {
      const lastThree = integerPart.slice(-3);
      const otherNumbers = integerPart.slice(0, -3);
      formattedInteger = otherNumbers
        ? otherNumbers.replace(/(\d)(?=(\d{2})+$)/g, '$1,') + ',' + lastThree
        : lastThree;
    } else {
      formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  // Filter state for search and type filtering.
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  // Retrieve the account statement data (and loading/error state) from Redux
  const { statementData, loading, error, balanceData } = useSelector((state: RootState) => state.accountBalance);

  // Utility function to get the previous date in "YYYYMMDD" format.
  const getPreviousDateString = (): string => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // Fetch balance and account statement on mount.
  useEffect(() => {
    dispatch(fetchBalanceEnquiry({ accountNo: '8827210000027502', accountCcy: 'INR' }))
      .then(unwrapResult)
      .then((response) => {
        setBalance(response?.data?.accountBalResponse?.clsAvailableBal || 0);
      })
      .catch((err) => {
        toast.error(err);
      });

    const previousBizDate = getPreviousDateString();
    dispatch(fetchAccountStatement({ accountNo: '8827210000027502', accountCcy: 'INR', bizDate: previousBizDate }))
      .then(unwrapResult)
      .catch((err) => console.error('Account statement error:', err));
  }, [dispatch]);

  // Map the API response's stmt array to our transaction format.
  const actualTransactions = useMemo(() => {
    if (statementData && statementData.data && statementData.data.statements && statementData.data.statements.length > 0) {
      const stmtArray = statementData.data.statements[0]?.bkToCstmrStmt?.stmt || [];
      return stmtArray.map((tx: any) => ({
        id: tx.id,
        // Use the date from the first balance element if available, otherwise the creation datetime.
        date: tx.bal && tx.bal.length > 0 ? tx.bal[0].dt.dt : tx.creDtTm,
        description: tx.acct?.nm,
        amount: tx.bal && tx.bal.length > 0 ? tx.bal[0].amt.value : 0,
        type: tx.bal && tx.bal.length > 0 ? (tx.bal[0].cdtDbtInd === 'CRDT' ? 'credit' : 'debit') : 'credit',
      }));
    }
    return [];
  }, [statementData]);

  // Apply filters to the transactions.
  const filteredTransactions = useMemo(() => {
    return actualTransactions.filter((tx: any) => {
      const matchesQuery = tx.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || tx.type === filterType;
      return matchesQuery && matchesType;
    });
  }, [actualTransactions, searchQuery, filterType]);

  // Export PDF using jsPDF and autoTable.
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Account Statement', 14, 16);
    const tableColumn = ['Date', 'Description', 'Amount'];
    const tableRows: any[] = [];

    filteredTransactions.forEach((tx: any) => {
      const txData = [tx.date, tx.description, `₹${tx.amount}`];
      tableRows.push(txData);
    });

    (doc as any).autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('account_statement.pdf');
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Account Statement
        </Typography>
        <Grid container spacing={2}>
          {/* Left Column: Balance & Financial Insights */}
          <Grid item xs={12} md={4}>
            {/* Balance Section */}
            <Card sx={{ mb: 2 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    value={balancePercentage}
                    size={100}
                    sx={{
                      color: 'primary.main',
                      // background: 'conic-gradient(#4caf50, #81c784)',
                      borderRadius: '50%',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" component="div" fontWeight="bold">
                      ₹{formatWithCommas(String(balance), "IND")}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle1">Available Balance</Typography>
              </CardContent>
            </Card>

            {/* Financial Insights: Spending Trends Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Spending Trends
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={sampleTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="spending" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Filters, Export Options & Transaction History */}
          <Grid item xs={12} md={8}>
            {/* Filters and Export Toolbar */}
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <TextField
                label="Search Transactions"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <ToggleButtonGroup
                value={filterType}
                exclusive
                onChange={(_e, newValue) => {
                  if (newValue !== null) setFilterType(newValue);
                }}
                size="small"
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="debit">Debit</ToggleButton>
                <ToggleButton value="credit">Credit</ToggleButton>
              </ToggleButtonGroup>

              {/* <Button variant="contained" color="primary">
                <CSVLink
                  data={filteredTransactions.map((tx: any) => ({
                    Date: tx.date,
                    Description: tx.description,
                    Amount: tx.amount,
                  }))}
                  filename="account_statement.csv"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Export CSV
                </CSVLink>
              </Button>
              <Button variant="contained" color="secondary" onClick={exportPDF}>
                Export PDF
              </Button> */}
            </Box>

            {/* Transaction History List */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction History
                </Typography>
                <List disablePadding>
                  {filteredTransactions.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      No transactions found.
                    </Typography>
                  ) : (
                    filteredTransactions.map((transaction: any) => (
                      <React.Fragment key={transaction.id}>
                        <ListItem>
                          <ListItemText
                            primary={`${transaction.date} — ${transaction.description}`}
                            secondary={
                              <Typography
                                variant="body2"
                                sx={{
                                  color: transaction.type === 'debit' ? 'red' : 'green',
                                }}
                              >
                                {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AccountStatement;
