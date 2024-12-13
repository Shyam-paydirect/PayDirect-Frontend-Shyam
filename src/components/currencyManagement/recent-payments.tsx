// RecentPayments.tsx (Recent Payments Component)
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './currency-management.css';
import '@/../public/assets/css/table.css';
import '@/../public/assets/css/master.css';


interface Transaction {
  transaction_time: string;
  transaction_value: number;
  transaction_curr_code: string;
  location: string;
}

const RecentPayments: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch transactions from API
    const page = 1;
    const pageSize = 10;
    const filterOn = 'merchant_id';
    const filterVal = 'fb786774-411e-4450-876b-7c51f0382c5f';
    const sortOn = 'merchant_id';
    const sortBy = 'asc';

    // fetch(
    //   `/api/transactions?page=${page}&pageSize=${pageSize}&filterOn=${filterOn}&filterVal=${filterVal}&sortOn=${sortOn}&sortBy=${sortBy}`
    // )
    //   .then((response) => response.json())
    //   .then((data) => setTransactions(data.data))
    //   .catch((error) => console.error('Error fetching transactions:', error));
  }, []);

  return (
    <Card className="table-container">
      <CardContent>
        <section className="table-header">
          <Typography variant="h4" className="cardHeading">
            <i className="ri-table-line"></i> Recent Payments
          </Typography>
        </section>
        <Divider />
        <section className="table-body scroll">
        <Table className="ledger">
            <TableHead>
              <TableRow >
                <TableCell>Transaction Time</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(transaction.transaction_time).toLocaleString()}</TableCell>
                  <TableCell>{transaction.transaction_value}</TableCell>
                  <TableCell>{transaction.transaction_curr_code}</TableCell>
                  <TableCell>{transaction.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </CardContent>
    </Card>
  );
};

export default RecentPayments;
