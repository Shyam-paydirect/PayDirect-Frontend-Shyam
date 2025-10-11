import React, { useState, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { 
  Search, 
  Refresh,
  KeyboardArrowDown
} from '@mui/icons-material';
import "./PayoutsDashboard.css";

type Payout = {
  id: string;
  initiatedOn: string;
  payoutReference: string;
  grossPayout: number;
  grossPayoutCurrency: string;
  settledAmount: number;
  settledAmountCurrency: string;
  status: "Settled" | "Pending" | "Failed";
  expectedOn: string;
};

const dummyPayouts: Payout[] = [
  { 
    id: "1", 
    initiatedOn: "29 Sep 2025", 
    payoutReference: "17591694139WIM01", 
    grossPayout: 110.00, 
    grossPayoutCurrency: "USD", 
    settledAmount: 8874.95, 
    settledAmountCurrency: "INR", 
    status: "Settled", 
    expectedOn: "01 Oct 2025" 
  },
  { 
    id: "2", 
    initiatedOn: "28 Sep 2025", 
    payoutReference: "17591694139WIM02", 
    grossPayout: 250.00, 
    grossPayoutCurrency: "USD", 
    settledAmount: 20175.00, 
    settledAmountCurrency: "INR", 
    status: "Pending", 
    expectedOn: "02 Oct 2025" 
  },
  { 
    id: "3", 
    initiatedOn: "27 Sep 2025", 
    payoutReference: "17591694139WIM03", 
    grossPayout: 500.00, 
    grossPayoutCurrency: "USD", 
    settledAmount: 40350.00, 
    settledAmountCurrency: "INR", 
    status: "Settled", 
    expectedOn: "30 Sep 2025" 
  },
  { 
    id: "4", 
    initiatedOn: "26 Sep 2025", 
    payoutReference: "17591694139WIM04", 
    grossPayout: 75.00, 
    grossPayoutCurrency: "USD", 
    settledAmount: 6052.50, 
    settledAmountCurrency: "INR", 
    status: "Failed", 
    expectedOn: "29 Sep 2025" 
  },
  { 
    id: "5", 
    initiatedOn: "25 Sep 2025", 
    payoutReference: "17591694139WIM05", 
    grossPayout: 300.00, 
    grossPayoutCurrency: "USD", 
    settledAmount: 24210.00, 
    settledAmountCurrency: "INR", 
    status: "Settled", 
    expectedOn: "28 Sep 2025" 
  },
  { 
    id: "6", 
    initiatedOn: "24 Sep 2025", 
    payoutReference: "17591694139WIM06", 
    grossPayout: 150.00, 
    grossPayoutCurrency: "USD", 
    settledAmount: 12105.00, 
    settledAmountCurrency: "INR", 
    status: "Pending", 
    expectedOn: "27 Sep 2025" 
  },
];

type StatusCounts = {
  Settled: number;
  Pending: number;
  Failed: number;
};

const PayoutsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [payouts, setPayouts] = useState<Payout[]>(dummyPayouts);
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState<string>("This Financial Year (1 Apr, 2025 - 31 Mar, 2026)");
  const [viewBy, setViewBy] = useState<string>("Monthly");

  // Generate chart data from actual payouts data
  const generateChartData = (dataToUse: Payout[] = payouts) => {
    const monthLabels = [
      "Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25",
      "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26"
    ];

    // Initialize chart data with zero amounts
    const chartData = monthLabels.map(month => ({ month, amount: 0 }));

    // Process payouts data and group by month
    dataToUse.forEach(payout => {
      // Parse the initiated date (format: "29 Sep 2025")
      const dateParts = payout.initiatedOn.split(' ');
      const day = parseInt(dateParts[0]);
      const monthName = dateParts[1];
      const year = parseInt(dateParts[2]);

      // Map month names to chart indices
      const monthMap: { [key: string]: number } = {
        'Jan': 9, 'Feb': 10, 'Mar': 11, 'Apr': 0, 'May': 1, 'Jun': 2,
        'Jul': 3, 'Aug': 4, 'Sep': 5, 'Oct': 6, 'Nov': 7, 'Dec': 8
      };

      const monthIndex = monthMap[monthName];
      
      // Only include data for the current financial year (2025-2026)
      if (year === 2025 && monthIndex !== undefined) {
        chartData[monthIndex].amount += payout.settledAmount;
      } else if (year === 2026 && monthIndex !== undefined && monthIndex >= 9) {
        // For 2026, only include Jan, Feb, Mar (indices 9, 10, 11)
        chartData[monthIndex].amount += payout.settledAmount;
      }
    });

    return chartData;
  };

  const filteredData = useMemo(() => {
    return payouts.filter((p) =>
      searchTerm
        ? p.payoutReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );
  }, [searchTerm, payouts]);

  const chartData = generateChartData(filteredData);
  const totalPayoutAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const maxAmount = Math.max(...chartData.map(item => item.amount));

  const totalPayouts = filteredData.length;
  const totalGrossPayout = filteredData.reduce((sum, p) => sum + p.grossPayout, 0);
  const totalSettledAmount = filteredData.reduce((sum, p) => sum + p.settledAmount, 0);
  const statusCounts: StatusCounts = filteredData.reduce(
    (acc: StatusCounts, p) => {
      acc[p.status] += 1;
      return acc;
    },
    { Settled: 0, Pending: 0, Failed: 0 }
  );

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      // For now, use mock data. Replace with actual API call:
      // const data = await payoutsService.getPayouts();
      // setPayouts(data);
      setPayouts(dummyPayouts);
    } catch (err: any) {
      console.error('Failed to fetch payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Load payouts on component mount
  React.useEffect(() => {
    fetchPayouts();
  }, []);

  return (
    <div className="payouts-dashboard-container">
      {/* Header */}
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" className="dashboard-title">
            Payouts Dashboard
          </Typography>
          <Typography variant="body1" className="dashboard-subtitle">
            Manage your payouts and track payment status
          </Typography>
        </Box>
      </Box>

      {/* Chart Section */}
      <Card className="chart-card">
        <CardContent>
          {/* Chart Header */}
          <Box className="chart-header">
            <Box className="chart-header-left">
              <Typography variant="body1" className="chart-header-text">
                Total Payouts during
              </Typography>
              <FormControl size="small" className="time-period-select">
                <Select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  IconComponent={KeyboardArrowDown}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '4px 8px',
                      fontSize: '14px',
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="This Financial Year (1 Apr, 2025 - 31 Mar, 2026)">
                    This Financial Year (1 Apr, 2025 - 31 Mar, 2026)
                  </MenuItem>
                  <MenuItem value="Last Financial Year (1 Apr, 2024 - 31 Mar, 2025)">
                    Last Financial Year (1 Apr, 2024 - 31 Mar, 2025)
                  </MenuItem>
                  <MenuItem value="This Calendar Year (1 Jan, 2025 - 31 Dec, 2025)">
                    This Calendar Year (1 Jan, 2025 - 31 Dec, 2025)
                  </MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body1" className="chart-header-text">
                :
              </Typography>
              <Box className="total-amount-display">
                <Box className="green-dot"></Box>
                <Typography variant="h6" className="total-amount">
                  INR {totalPayoutAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
            <Box className="chart-header-right">
              <Typography variant="body1" className="chart-header-text">
                View By:
              </Typography>
              <FormControl size="small" className="view-by-select">
                <Select
                  value={viewBy}
                  onChange={(e) => setViewBy(e.target.value)}
                  IconComponent={KeyboardArrowDown}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '4px 8px',
                      fontSize: '14px',
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Chart */}
          <Box className="chart-container">
            <Box className="chart-y-axis">
              <Typography variant="caption" className="y-axis-label">
                INR
              </Typography>
            </Box>
            <Box className="chart-content">
              <Box className="chart-bars">
                {chartData.map((item, index) => (
                  <Box key={index} className="chart-bar-container">
                    <Box
                      className="chart-bar"
                      style={{
                        height: maxAmount > 0 ? `${(item.amount / maxAmount) * 100}%` : '0%',
                        backgroundColor: item.amount > 0 ? '#4ade80' : 'transparent'
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Box className="chart-x-axis">
                {chartData.map((item, index) => (
                  <Typography key={index} variant="caption" className="x-axis-label">
                    {item.month}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="filters-card">
        <CardContent>
          <Box className="filters-container">
            <TextField
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              className="search-field"
            />
            <Button
              variant="outlined"
              onClick={fetchPayouts}
              disabled={loading}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card className="table-card">
        <CardContent>
          <Box className="table-header">
            <Typography variant="h5" className="table-title">
              Payouts
            </Typography>
          </Box>

          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Initiated On</TableCell>
                  <TableCell>Payout Reference</TableCell>
                  <TableCell>Gross Payout</TableCell>
                  <TableCell>Settled Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Expected On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((payout) => (
                  <TableRow key={payout.id} className="table-row">
                    <TableCell>
                      <Typography variant="body2" className="date-text">
                        {payout.initiatedOn}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="reference-number">
                        {payout.payoutReference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="amount">
                        {formatCurrency(payout.grossPayout, payout.grossPayoutCurrency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="amount">
                        {formatCurrency(payout.settledAmount, payout.settledAmountCurrency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payout.status}
                        color={getStatusColor(payout.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="date-text">
                        {payout.expectedOn}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredData.length === 0 && !loading && (
            <Box className="empty-state">
              <Typography variant="h6" color="textSecondary">
                No payouts found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {searchTerm ? 'Try adjusting your search criteria' : 'No payouts available'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutsDashboard;
