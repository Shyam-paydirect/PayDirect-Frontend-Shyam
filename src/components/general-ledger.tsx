// general-ledger.tsx (General Ledger Component)
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/redux/store';
import './general-ledger.css';
import { Card, CardContent, Typography, Divider, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// import '../../public/assets/css/master.css'
// import '../../public/assets/css/table.css'

interface Transaction {
  transaction_id: string;
  transaction_time: string;
  transaction_value: number;
  transaction_curr_code: string;
  transaction_type: string;
  transaction_mode: string;
  external_id: string;
  location: string;
}

const GeneralLedger: React.FC = () => {
    console.log("Came thru here")
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const amount = 21230.3;
  const debit = 30000.051;
  const credit = 8769.751;

  useEffect(() => {
    // Mock data, replace with API call if needed
    setTransactions([
      {
        transaction_id: '12345',
        transaction_time: '2024-11-24 14:30',
        transaction_value: 100,
        transaction_curr_code: 'USD',
        transaction_type: 'SALE',
        transaction_mode: 'Card',
        external_id: 'EXT123',
        location: 'New York',
      },
    ]);
  }, []);

  return (
    <div className={`general-ledger-parent ${isDarkMode ? 'dark' : ''}`}>
      <div className="card-main">
        {[{
          title: 'Total Amount',
          iconClass: 'ri-money-dollar-circle-line',
          value: amount
        }, {
          title: 'Total Debits',
          iconClass: 'ri-arrow-down-circle-line',
          value: debit
        }, {
          title: 'Total Credits',
          iconClass: 'ri-arrow-up-circle-line',
          value: credit
        }].map((card, index) => (
          <Card key={index} className="commonCard">
            <CardContent>
              <section className="heading">
                <Typography variant="h5" className="cardHeading">
                  <i className={card.iconClass}></i> {card.title}
                </Typography>
              </section>
              <Divider />
              <section className="amount">
                <Typography variant="h6">${card.value.toFixed(2)}</Typography>
              </section>
            </CardContent>
          </Card>
        ))}
      </div>

      <main className="table-main">
        <div className="table-container">
          <section className="table-header">
            <Typography variant="h4" className="table-heading">
              <i className="ri-table-line"></i> General Ledger
            </Typography>
          </section>
          <Divider />
          <section className="table-body scroll">
            <Table className="ledger">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Transaction Time</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>External ID</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>{transaction.transaction_id}</TableCell>
                    <TableCell>{transaction.transaction_time}</TableCell>
                    <TableCell>${transaction.transaction_value.toFixed(2)}</TableCell>
                    <TableCell>{transaction.transaction_curr_code}</TableCell>
                    <TableCell>
                      <Typography
                        className={`status capitalize ${transaction.transaction_type.toLowerCase()}`}
                      >
                        <i className={`ri ${getTransactionIcon(transaction.transaction_type)}`}></i>
                        {transaction.transaction_type}
                      </Typography>
                    </TableCell>
                    <TableCell>{transaction.transaction_mode}</TableCell>
                    <TableCell>{transaction.external_id}</TableCell>
                    <TableCell>{transaction.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </main>
    </div>
  );
};

const getTransactionIcon = (transactionType: string): string => {
  switch (transactionType.toUpperCase()) {
    case 'SALE':
      return 'ri-shopping-cart-fill';
    case 'REFUND':
      return 'ri-refund-fill';
    case 'CASHBACK':
      return 'ri-cash-fill';
    case 'DUES':
      return 'ri-file-paper-2-fill';
    case 'CHARGES':
      return 'ri-money-dollar-circle-fill';
    default:
      return 'ri-question-line';
  }
};

export default GeneralLedger;
