import React, { useState, useMemo } from "react";
import receivablesService from "@/services/receivables.service";
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
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
  CircularProgress
} from '@mui/material';
import { 
  Search, 
  Refresh,
  Settings
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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [payouts, setPayouts] = useState<Payout[]>(dummyPayouts);
  const [loading, setLoading] = useState(false);

  const filteredData = useMemo(() => {
    return payouts.filter((p) =>
      searchTerm
        ? p.payoutReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );
  }, [searchTerm, payouts]);

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
      const apiPayouts = await receivablesService.fetchPayouts();
      const mapped: Payout[] = (apiPayouts || []).map((p: any) => {
        const createdIso = p.created_at
          || p.createdAt
          || (typeof p.created === 'number' ? new Date(p.created * 1000).toISOString() : new Date().toISOString());
        const expectedTs = typeof p.arrival_date === 'number' ? p.arrival_date * 1000
          : (p.expected_on ? Date.parse(p.expected_on) : NaN);
        return {
          id: p.id || p.payout_id || Math.random().toString(36).slice(2),
          initiatedOn: new Date(createdIso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          payoutReference: p.statement_descriptor || p.unique_transaction_reference || p.reference || p.payout_reference || p.id || 'PAYOUT',
          grossPayout: Number(p.amount || p.gross_payout || 0),
          grossPayoutCurrency: p.currency || p.gross_payout_currency || 'USD',
          settledAmount: Number(p.settled_amount || p.net_amount || p.amount || 0),
          settledAmountCurrency: p.settled_amount_currency || p.settled_currency || p.currency || 'INR',
          status: String(p.status || 'Pending').charAt(0).toUpperCase() + String(p.status || 'Pending').slice(1) as any,
          expectedOn: isNaN(expectedTs) ? '' : new Date(expectedTs).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
      });
      setPayouts(mapped);
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
      {/* Search and Filters */}
      <Card className="filters-card">
        <CardContent>
          <Box className="filters-container">
            <Box className="filters-left">
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
            </Box>
            <Box className="filters-right">
              <Button
                variant="outlined"
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
                startIcon={<Settings />}
                onClick={() => router.push('/settings')}
              >
                Settings
              </Button>
              <Button
                variant="contained"
                onClick={fetchPayouts}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
                startIcon={!loading ? <Refresh /> : undefined}
              >
                {loading ? <CircularProgress size={20} /> : 'Refresh'}
              </Button>
            </Box>
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
                      <Button
                        variant="text"
                        sx={{ textTransform: 'none', padding: 0, minWidth: 'unset' }}
                        onClick={() => router.push(`/payout/${payout.payoutReference}`)}
                      >
                        <Typography variant="body2" className="reference-number" color="primary">
                          {payout.payoutReference}
                        </Typography>
                      </Button>
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
